// src/shared/infrastructure/SocketManager.ts
import { Server as SocketServer, Socket } from "socket.io";
import { Server as HTTPServer } from "https";

// Socket event types for type safety
export enum SocketEvents {
  // Connection events
  CONNECTION = "connection",
  DISCONNECT = "disconnect",

  // Order events
  TRACK_ORDER = "track:order",
  UNTRACK_ORDER = "untrack:order",
  ORDER_NEW = "order:new",
  ORDER_UPDATED = "order:updated",
  ORDER_STATUS = "order:status",
  ORDER_CANCELLED = "order:cancelled",
  ORDER_TRACKING = "order:tracking",

  // Payment events
  PAYMENT_SUCCESS = "payment:success",
  PAYMENT_FAILED = "payment:failed",

  // Menu events
  MENU_CREATED = "menu:created",
  MENU_UPDATED = "menu:updated",
  MENU_DELETED = "menu:deleted",
  PRODUCT_AVAILABILITY = "product:availability",

  // Category events
  CATEGORY_CREATED = "category:created",
  CATEGORY_UPDATED = "category:updated",
  CATEGORY_DELETED = "category:deleted",

  // Admin events
  ADMIN_JOIN = "admin:join",
  ADMIN_LEAVE = "admin:leave",

  // Kitchen events
  KITCHEN_JOIN = "kitchen:join",
  KITCHEN_LEAVE = "kitchen:leave",
  KITCHEN_ORDER_READY = "kitchen:order_ready",

  // Notification events
  NOTIFICATION = "notification",
  ALERT = "alert",
}

// Event payload types
export interface OrderUpdatePayload {
  orderId: string;
  status: string;
  estimatedTime?: number;
  notes?: string;
  timestamp: Date;
}

export interface PaymentUpdatePayload {
  orderId: string;
  paymentId?: string;
  status: string;
  amount: number;
}

export interface ProductAvailabilityPayload {
  productId: string;
  isAvailable: boolean;
  reason?: string;
}

export interface NotificationPayload {
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

// Room identifiers
export enum SocketRooms {
  ADMIN = "admin-room",
  KITCHEN = "kitchen-room",
  CUSTOMER = "customer-room",
}

export class SocketManager {
  private static instance: SocketManager;
  private io: SocketServer | null = null;
  private connectedClients: Map<string, ClientInfo> = new Map();

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public initialize(server: HTTPServer): SocketServer {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.SOCKETMANAGER_PATH || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.setupEventHandlers();
    this.setupMiddleware();

    console.log("✅ Socket.IO initialized");

    return this.io;
  }

  public getIO(): SocketServer {
    if (!this.io) {
      throw new Error("Socket.IO not initialized");
    }
    return this.io;
  }

  private setupMiddleware(): void {
    this.io!.use((socket: Socket, next) => {
      // Authentication middleware
      const token =
        socket.handshake.auth.token || socket.handshake.headers.authorization;

      if (!token) {
        console.log(`Connection attempt without token: ${socket.id}`);
        // Allow connection but mark as unauthenticated
        (socket as any).isAuthenticated = false;
        return next();
      }

      try {
        // Verify token here if needed
        (socket as any).isAuthenticated = true;
        (socket as any).user = { id: "user-id", role: "customer" }; // Parse from token
        next();
      } catch (error) {
        console.error(`Authentication error for socket ${socket.id}:`, error);
        (socket as any).isAuthenticated = false;
        next();
      }
    });
  }

  private setupEventHandlers(): void {
    this.io!.on(SocketEvents.CONNECTION, (socket: Socket) => {
      const clientInfo: ClientInfo = {
        socketId: socket.id,
        connectedAt: new Date(),
        rooms: [],
        isAuthenticated: (socket as any).isAuthenticated || false,
        user: (socket as any).user,
      };

      this.connectedClients.set(socket.id, clientInfo);
      console.log(
        `✅ Client connected: ${socket.id} (Total: ${this.connectedClients.size})`
      );

      // Track order
      socket.on(SocketEvents.TRACK_ORDER, (orderId: string) => {
        if (!orderId) {
          socket.emit("error", { message: "Order ID is required" });
          return;
        }

        const room = this.getOrderRoom(orderId);
        socket.join(room);

        const client = this.connectedClients.get(socket.id);
        if (client) {
          client.rooms.push(room);
        }

        console.log(`📦 Socket ${socket.id} tracking order: ${orderId}`);
        socket.emit("tracking:confirmed", { orderId, room });
      });

      // Untrack order
      socket.on(SocketEvents.UNTRACK_ORDER, (orderId: string) => {
        if (!orderId) return;

        const room = this.getOrderRoom(orderId);
        socket.leave(room);

        const client = this.connectedClients.get(socket.id);
        if (client) {
          client.rooms = client.rooms.filter((r) => r !== room);
        }

        console.log(
          `📦 Socket ${socket.id} stopped tracking order: ${orderId}`
        );
      });

      // Admin join
      socket.on(SocketEvents.ADMIN_JOIN, () => {
        if (!(socket as any).isAuthenticated) {
          socket.emit("error", { message: "Authentication required" });
          return;
        }

        socket.join(SocketRooms.ADMIN);
        const client = this.connectedClients.get(socket.id);
        if (client) {
          client.rooms.push(SocketRooms.ADMIN);
        }

        console.log(`👤 Admin joined: ${socket.id}`);
        socket.emit("admin:joined", { room: SocketRooms.ADMIN });
      });

      // Kitchen join
      socket.on(SocketEvents.KITCHEN_JOIN, () => {
        if (!(socket as any).isAuthenticated) {
          socket.emit("error", { message: "Authentication required" });
          return;
        }

        socket.join(SocketRooms.KITCHEN);
        const client = this.connectedClients.get(socket.id);
        if (client) {
          client.rooms.push(SocketRooms.KITCHEN);
        }

        console.log(`🍳 Kitchen joined: ${socket.id}`);
        socket.emit("kitchen:joined", { room: SocketRooms.KITCHEN });
      });

      // Disconnect
      socket.on(SocketEvents.DISCONNECT, (reason: string) => {
        this.connectedClients.delete(socket.id);
        console.log(
          `❌ Client disconnected: ${socket.id} (Reason: ${reason}, Total: ${this.connectedClients.size})`
        );
      });

      // Error handling
      socket.on("error", (error: Error) => {
        console.error(`Socket error for ${socket.id}:`, error);
      });
    });
  }

  // Type-safe emit methods
  public emitOrderUpdate(orderId: string, payload: OrderUpdatePayload): void {
    const room = this.getOrderRoom(orderId);
    this.io!.to(room).emit(SocketEvents.ORDER_STATUS, payload);
  }

  public emitToAdmins(event: SocketEvents, data: unknown): void {
    this.io!.to(SocketRooms.ADMIN).emit(event, data);
  }

  public emitToKitchen(event: SocketEvents, data: unknown): void {
    this.io!.to(SocketRooms.KITCHEN).emit(event, data);
  }

  public broadcast(event: SocketEvents, data: unknown): void {
    this.io!.emit(event, data);
  }

  public emitNotification(
    target: "admin" | "kitchen" | "all",
    notification: NotificationPayload
  ): void {
    switch (target) {
      case "admin":
        this.emitToAdmins(SocketEvents.NOTIFICATION, notification);
        break;
      case "kitchen":
        this.emitToKitchen(SocketEvents.NOTIFICATION, notification);
        break;
      case "all":
        this.broadcast(SocketEvents.NOTIFICATION, notification);
        break;
    }
  }

  // Utility methods
  private getOrderRoom(orderId: string): string {
    return `order:${orderId}`;
  }

  public getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  public getClientsInRoom(room: string): number {
    return this.io?.sockets.adapter.rooms.get(room)?.size || 0;
  }

  public getClientInfo(socketId: string): ClientInfo | undefined {
    return this.connectedClients.get(socketId);
  }
}

interface ClientInfo {
  socketId: string;
  connectedAt: Date;
  rooms: string[];
  isAuthenticated: boolean;
  user?: {
    id: string;
    role: string;
  };
}
