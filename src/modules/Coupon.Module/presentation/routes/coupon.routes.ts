import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import {
  CreateCouponSchema,
  UpdateCouponSchema,
  ValidateCouponSchema,
  CouponIdSchema,
  CouponQuerySchema,
} from "../../application/validators/coupon.validators";
import { UserRole } from "@/shared/types/common.types";
import { ValidationMiddleware } from "@/shared/middleware/validation.middleware";
import { CouponController } from "../controllers/Coupon.controllers";
import { Router } from "express";

export class CouponRoutes {
  static create(controller: CouponController): Router {
    const router = Router();
    router.post(
      "/",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateBody(CreateCouponSchema),
      controller.createCoupon
    );
    router.post(
      "/validate",
      AuthMiddleware.authenticate,
      ValidationMiddleware.validateBody(ValidateCouponSchema),
      controller.validateCoupon
    );
    router.get(
      "/",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateQuery(CouponQuerySchema),
      controller.getCoupons
    );
    router.get(
      "/:id",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateParams(CouponIdSchema),
      controller.getCouponById
    );
    router.put(
      "/:id",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateParams(CouponIdSchema),
      ValidationMiddleware.validateBody(UpdateCouponSchema),
      controller.updateCoupon
    );
    router.delete(
      "/:id",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateParams(CouponIdSchema),
      controller.deleteCoupon
    );
    return router;
  }
}
