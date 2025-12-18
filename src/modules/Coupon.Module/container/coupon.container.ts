import { Container } from "@/shared/container/container";
import { CouponRepository } from "../infrastructure/repositories/CouponRepository";
import { TYPES } from "@/shared/container/types";
import { CouponService } from "../application/services/Coupon.service";
import { CouponController } from "../presentation/controllers/Coupon.controllers";

export function registerCouponModule(container: Container): void {
  console.log("📦 Registering Coupon Module...");

  // 1. Register Repository
  const couponRepository = new CouponRepository();
  container.register(TYPES.CouponRepository, couponRepository);

  // 2. Register Service
  const couponService = new CouponService(
    container.resolve(TYPES.CouponRepository)
  );
  container.register(TYPES.CouponService, couponService);

  // 3. Register Controller
  const couponController = new CouponController(
    container.resolve(TYPES.CouponService)
  );
  container.register(TYPES.CouponController, couponController);

  console.log("✅ Coupon Module registered");
}
