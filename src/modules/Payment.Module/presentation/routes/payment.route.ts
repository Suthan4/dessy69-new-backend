import { Router } from "express";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import {
  CreatePaymentOrderSchema,
  VerifyPaymentSchema,
} from "../../application/validators/payment.validators";
import { ValidationMiddleware } from "@/shared/middleware/validation.middleware";
import { PaymentController } from "../controllers/Payment.controller";

export class PaymentRoutes {
  static create(controller: PaymentController): Router {
    const router = Router();
    router.post(
      "/create-order",
      AuthMiddleware.authenticate,
      ValidationMiddleware.validateBody(CreatePaymentOrderSchema),
      controller.createPaymentOrder
    );
    router.post(
      "/verify",
      AuthMiddleware.authenticate,
      ValidationMiddleware.validateBody(VerifyPaymentSchema),
      controller.verifyPayment
    );
    return router;
  }
}
