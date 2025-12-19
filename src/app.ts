import express, { Express, Request, Response } from "express";
import { applySecurity } from "@suthan4/core-package";
import { createServer, Server } from "https";
import { PaymentRoutes } from "./modules/Payment.Module/presentation/routes/payment.route";
import cors from "cors";
import { AuthRoutes } from "./modules/Auth.Module/presentation/routes/auth.routes";
import { CategoryRoutes } from "./modules/Category.Module/presentation/routes/category.routes";
import { ProductRoutes } from "./modules/Product.Module/presentation/routes/product.routes";
import { OrderRoutes } from "./modules/Order.Module/presentation/routes/order.routes";
import { CouponRoutes } from "./modules/Coupon.Module/presentation/routes/coupon.routes";
import { SocketManager } from "./shared/infrastructure/SocketManager";
import { Container } from "./shared/container/container";
import { initializeContainer } from "./shared/container";
import { TYPES } from "./shared/container/types";
import { AuthController } from "./modules/Auth.Module/presentation/controllers/Auth.controller";
import { CategoryController } from "./modules/Category.Module/presentation/controllers/Category.controller";
import { ProductController } from "./modules/Product.Module/presentation/controllers/Product.controller";
import { CouponController } from "./modules/Coupon.Module/presentation/controllers/Coupon.controllers";
import { OrderController } from "./modules/Order.Module/presentation/controllers/Order.controller";
import { PaymentController } from "./modules/Payment.Module/presentation/controllers/Payment.controller";
import cookieParser from "cookie-parser";
import { AppConfig } from "./config/app.config";

export class Application {
  private app: Express;
  private server: Server;
  private container: Container;

  constructor() {
    this.app = express();

    // Initialize DI Container FIRST
    this.container = initializeContainer();

    // Then setup everything else
    this.setupSecurity(); // FIRST
    this.setupMiddlware(); // THEN body, cookies, cors
    this.setupStaticRoute();

    // Create HTTP server and Socket.IO
    this.server = createServer(this.app);
    // Setup Socket.IO with the HTTP server
    this.setupSocket();
    // Setup routes last
    this.setupRoutes();
  }

  private setupMiddlware(): void {
    this.app.set("trust proxy", 1);
    this.app.use(
      cors({
        origin: [
          "https://dessy69.in",
          "https://www.dessy69.in",
          "https://localhost:3000",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      })
    );

    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupSecurity(): void {
    applySecurity(this.app);
  }

  private setupStaticRoute(): void {
    this.app.use(express.static("public"));
  }

  private setupRoutes(): void {
    this.app.use((req, _, next) => {
      console.log("=== Request Debug ===");
      console.log("Origin:", req.headers.origin);
      console.log("Incoming cookies:", req.cookies);
      console.log("Headers:", req.headers);
      console.log("===================");
      next();
    });
    this.app.get("/", (_, res: Response) => {
      res.json({
        status: "OK",
        description:
          "🍨 Dessy69 Cafe - Fruit Fuelled! Server Running Successfully",
      });
    });
    console.log("🛣️  Setting up Routes...");

    // Resolve controllers from container
    const authController = this.container.resolve<AuthController>(
      TYPES.AuthController
    );
    const categoryController = this.container.resolve<CategoryController>(
      TYPES.CategoryController
    );
    const productController = this.container.resolve<ProductController>(
      TYPES.ProductController
    );
    const couponController = this.container.resolve<CouponController>(
      TYPES.CouponController
    );
    const orderController = this.container.resolve<OrderController>(
      TYPES.OrderController
    );
    const paymentController = this.container.resolve<PaymentController>(
      TYPES.PaymentController
    );

    // Setup routes using resolved controllers
    this.app.use("/api/auth", AuthRoutes.create(authController));
    this.app.use("/api/categories", CategoryRoutes.create(categoryController));
    this.app.use("/api/products", ProductRoutes.create(productController));
    this.app.use("/api/coupons", CouponRoutes.create(couponController));
    this.app.use("/api/orders", OrderRoutes.create(orderController));
    this.app.use("/api/payment", PaymentRoutes.create(paymentController));

    console.log("✅ All routes initialized successfully");
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
  public getContainer(): Container {
    return this.container;
  }
}
