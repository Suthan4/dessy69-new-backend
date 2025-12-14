import { Router } from "express";
import { OrderController } from "../controllers/Order.controller";
import { OrderRepository } from "@/infrastructure/database/repositories/OrderRepository";
import { CouponRepository } from "@/infrastructure/database/repositories/CouponRepository";
import { ProductRepository } from "@/infrastructure/database/repositories/ProductRepository";
import { OrderService } from "@/application/services/Order.service";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { OrderSchema, VerifyPaymentSchema } from "../validators/schema";

export class OrderRoutes {
  public router: Router;
  private controller: OrderController;

  constructor() {
    this.router = Router();
    const orderRepository = new OrderRepository();
    const couponRepository = new CouponRepository();
    const productRepository = new ProductRepository();
    const service = new OrderService(
      orderRepository,
      couponRepository,
      productRepository
    );
    this.controller = new OrderController(service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Public/Customer routes
    this.router.post("/", validate(OrderSchema), this.controller.createOrder);
    this.router.post(
      "/verify-payment",
      validate(VerifyPaymentSchema),
      this.controller.verifyPayment
    );
    this.router.get("/track/:orderId", this.controller.getOrderByOrderId);
    this.router.get("/customer", this.controller.getUserOrders);

    // Admin routes
    this.router.get(
      "/",
      authenticate,
      authorizeAdmin,
      this.controller.getAllOrders
    );
    this.router.get(
      "/stats",
      authenticate,
      authorizeAdmin,
      this.controller.getOrderStats
    );
    this.router.put(
      "/:orderId/status",
      authenticate,
      authorizeAdmin,
      this.controller.updateOrderStatus
    );
    this.router.patch(
      "/:orderId/cancel",
      authenticate,
      authorizeAdmin,
      this.controller.cancelOrder
    );
  }
}
