import { Server as SocketServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

export class SocketManager {
  private static instance: SocketManager;
  private io: SocketServer | null = null;

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
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    this.setupEventHandlers();
    console.log("✅ Socket.IO initialized");

    return this.io;
  }

  public getIO(): SocketServer {
    if (!this.io) {
      throw new Error("Socket.IO not initialized");
    }
    return this.io;
  }

  private setupEventHandlers(): void {
    this.io!.on("connection", (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Join order tracking room
      socket.on("track:order", (orderId: string) => {
        socket.join(`order:${orderId}`);
        console.log(`Socket ${socket.id} tracking order ${orderId}`);
      });

      // Leave order tracking room
      socket.on("untrack:order", (orderId: string) => {
        socket.leave(`order:${orderId}`);
      });

      // Admin joins admin room
      socket.on("admin:join", () => {
        socket.join("admin-room");
        console.log(`Admin joined: ${socket.id}`);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  // Emit to specific order room
  public emitOrderUpdate(orderId: string, event: string, data: any): void {
    this.io!.to(`order:${orderId}`).emit(event, data);
  }

  // Emit to all admins
  public emitToAdmins(event: string, data: any): void {
    this.io!.to("admin-room").emit(event, data);
  }

  // Broadcast to all clients
  public broadcast(event: string, data: any): void {
    this.io!.emit(event, data);
  }
}
