import { Router } from "express";
import { OrderController } from "../controllers/Order.controller";
import { OrderRepository } from "@/infrastructure/database/repositories/OrderRepository";
import { CouponRepository } from "@/infrastructure/database/repositories/CouponRepository";
import { OrderService } from "@/application/services/Order.service";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { OrderSchema } from "../validators/schema";

export class OrderRoutes {
  public router: Router;
  private controller: OrderController;

  constructor() {
    this.router = Router();
    const orderRepository = new OrderRepository();
    const couponRepository = new CouponRepository();
    const service = new OrderService(orderRepository, couponRepository);
    this.controller = new OrderController(service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Customer routes
    this.router.post(
      "/",
      authenticate,
      validate(OrderSchema),
      this.controller.createOrder
    );

    this.router.get("/my-orders", authenticate, this.controller.getUserOrders);

    // Admin routes
    this.router.get(
      "/",
      authenticate,
      authorizeAdmin,
      this.controller.getAllOrders
    );

    this.router.patch(
      "/:id/status",
      authenticate,
      authorizeAdmin,
      this.controller.updateOrderStatus
    );

    this.router.patch(
      "/:id/cancel",
      authenticate,
      authorizeAdmin,
      this.controller.cancelOrder
    );
  }
}
