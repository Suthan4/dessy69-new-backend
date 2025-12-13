import express, { Express,Request, Response } from "express";
import { applySecurity } from "dessy69-core-packages";
import { AuthRoutes } from "./presentation/routes/auth.routes";
import { ProductRoutes } from "./presentation/routes/product.routes";
import { OrderRoutes } from "./presentation/routes/order.routes";
import { CouponRoutes } from "./presentation/routes/coupon.routes";
import { createServer } from "http";
import { SocketManager } from "./infrastructure/socket/SocketManager";

export class Application {
  private app: Express;

  constructor() {
    this.app = express();
    this.setupMiddlware();
    this.setupSecurity();
    this.setupStaticRoute();
    this.setupRoutes();
    this.setupSocket();
  }

  private setupMiddlware(): void {
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
        description: "🎉 Server Running Successfully",
      });
    });
    this.app.use("/api/auth", new AuthRoutes().router);
    this.app.use("/api/products", new ProductRoutes().router);
    this.app.use("/api/orders", new OrderRoutes().router);
    this.app.use("/api/coupons", new CouponRoutes().router);

  }

  private setupSocket(): void {
    const server = createServer(this.app);
    const socketManager = SocketManager.getInstance();
    const io = socketManager.initialize(server);

    // Make io available in requests
    this.app.use((req: Request, res: Response, next) => {
      (req as any).io = io;
      next();
    });
  }

  public getApp(): Express {
    return this.app;
  }
}
