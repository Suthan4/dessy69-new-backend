import { Router } from "express";
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  OrderQuerySchema,
  OrderIdSchema,
} from "../../application/validators/order.validators";
import { OrderController } from "../controllers/Order.controller";
import { ValidationMiddleware } from "@/shared/middleware/validation.middleware";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { UserRole } from "@/shared/types/common.types";

export class OrderRoutes {
  static create(controller: OrderController): Router {
    const router = Router();
    router.post(
      "/",
      AuthMiddleware.authenticate,
      ValidationMiddleware.validateBody(CreateOrderSchema),
      controller.createOrder
    );
    router.get(
      "/my-orders",
      AuthMiddleware.authenticate,
      ValidationMiddleware.validateQuery(OrderQuerySchema),
      controller.getMyOrders
    );
    router.get(
      "/",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateQuery(OrderQuerySchema),
      controller.getAllOrders
    );
    router.get(
      "/:id",
      AuthMiddleware.authenticate,
      ValidationMiddleware.validateParams(OrderIdSchema),
      controller.getOrderById
    );
    router.patch(
      "/:id/status",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateParams(OrderIdSchema),
      ValidationMiddleware.validateBody(UpdateOrderStatusSchema),
      controller.updateOrderStatus
    );
    router.patch(
      "/:id/cancel",
      AuthMiddleware.authenticate,
      ValidationMiddleware.validateParams(OrderIdSchema),
      controller.cancelOrder
    );
    return router;
  }
}
