import { CouponEntity } from "../entities/Coupon.entity";

export interface ICouponRepository {
  create(coupon: CouponEntity): Promise<CouponEntity>;
  findById(id: string): Promise<CouponEntity | null>;
  findByCode(code: string): Promise<CouponEntity | null>;
  update(id: string, data: Partial<CouponEntity>): Promise<CouponEntity | null>;
  incrementUsage(id: string): Promise<void>;
  delete(id: string): Promise<boolean>;
  findAll(
    page: number,
    limit: number
  ): Promise<{ coupons: CouponEntity[]; total: number }>;
}
