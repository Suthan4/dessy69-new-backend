import { Router } from "express";
import { OrderController } from "../controllers/Order.controller";
import { OrderRepository } from "@/modules/Order.Module/infrastructure/repositories/OrderRepository";
import { CouponRepository } from "@/modules/Coupon.Module/infrastructure/repositories/CouponRepository";
import { ProductRepository } from "@/modules/Product.Module/infrastructure/repositories/ProductRepository";
import { OrderService } from "@/modules/Order.Module/application/services/Order.service";
import { validate } from "@/shared/middleware/validation.middleware";
import { OrderSchema, VerifyPaymentSchema } from "@/modules/Product.Module/presentation/validators/schema";
import { authenticate, authorizeAdmin } from "@/shared/middleware/auth.middleware";


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
