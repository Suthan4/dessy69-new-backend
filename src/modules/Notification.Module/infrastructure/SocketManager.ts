import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { AppConfig } from "@/config/app.config";
import { OrderStatus } from "@/shared/types/common.types";
import { OrderEntity } from "@/modules/Order.Module/domain/entities/Order.entity";

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

  public initialize(httpServer: HttpServer): void {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: AppConfig.cors.origin,
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Join user-specific room
      socket.on("join", (userId: string) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their room`);
      });

      // Join admin room
      socket.on("join-admin", () => {
        socket.join("admin");
        console.log(`Admin joined`);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  public getIO(): SocketServer {
    if (!this.io) {
      throw new Error("Socket.IO not initialized");
    }
    return this.io;
  }

  // Emit product availability change
  public emitProductAvailability(
    productId: string,
    isAvailable: boolean,
    variantId?: string
  ): void {
    if (!this.io) return;
    this.io.emit("product:availability", { productId, isAvailable, variantId });
  }

  // Emit order status update to user
  public emitOrderStatusUpdate(
    userId: string,
    orderId: string,
    status: OrderStatus,
    message?: string
  ): void {
    if (!this.io) return;
    this.io
      .to(`user:${userId}`)
      .emit("order:status-update", {
        orderId,
        status,
        message,
        timestamp: new Date(),
      });
  }

  // Emit new order to admin
  public emitNewOrderToAdmin(order: OrderEntity): void {
    if (!this.io) return;
    this.io.to("admin").emit("order:new", { order, timestamp: new Date() });
  }
}
