import express, { Express, Request, Response } from "express";
import { applySecurity } from "dessy69-core-packages";
import { AuthRoutes } from "./presentation/routes/auth.routes";
import { ProductRoutes } from "./presentation/routes/product.routes";
import { OrderRoutes } from "./presentation/routes/order.routes";
import { CouponRoutes } from "./presentation/routes/coupon.routes";
import { createServer, Server } from "https";
import { SocketManager } from "./infrastructure/socket/SocketManager";
import { CategoryRoutes } from "./presentation/routes/category.routes";
import { PaymentRoutes } from "./presentation/routes/payment.route";
import cors from "cors";

export class Application {
  private app: Express;
  private server: Server;

  constructor() {
    this.app = express();
    this.setupMiddlware();
    this.setupSecurity();
    this.setupStaticRoute();
    this.setupRoutes();
    this.setupSocket();
    // 🔥 CREATE HTTPS SERVER ONCE
    this.server = createServer(this.app);

    // 🔥 ATTACH SOCKET.IO TO SAME SERVER
    this.setupSocket();
  }

  private setupMiddlware(): void {
    this.app.use(
      cors({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupSecurity(): void {
    applySecurity(this.app);
  }

  private setupStaticRoute(): void {
    this.app.use(express.static("public"));
  }

  private setupRoutes(): void {
    this.app.get("/", (_, res: Response) => {
      res.json({
        status: "OK",
        description:
          "🍨 Dessy69 Cafe - Fruit Fuelled! Server Running Successfully",
      });
    });
    this.app.use("/api/auth", new AuthRoutes().router);
    this.app.use("/api/categories", new CategoryRoutes().router);
    this.app.use("/api/products", new ProductRoutes().router);
    this.app.use("/api/orders", new OrderRoutes().router);
    this.app.use("/api/coupons", new CouponRoutes().router);
    this.app.use("/api/payment", new PaymentRoutes().router);
  }

  private setupSocket(): void {
    const socketManager = SocketManager.getInstance();
    const io = socketManager.initialize(this.server);

    // Make io available in requests
    this.app.use((req: Request, res: Response, next) => {
      (req as any).io = io;
      next();
    });
  }

  public getApp(): Express {
    return this.app;
  }
  public getServer(): Express {
    return this.app;
  }
}
