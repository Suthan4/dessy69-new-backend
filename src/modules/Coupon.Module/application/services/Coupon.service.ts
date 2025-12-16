import { CouponEntity } from "../../domain/entities/Coupon.entity";
import { ICouponRepository } from "../../domain/interfaces/ICouponRepository";

export class CouponService {
  constructor(private couponRepository: ICouponRepository) {}

  async createCoupon(data: any): Promise<CouponEntity> {
    const existing = await this.couponRepository.findByCode(data.code);
    if (existing) throw new Error("Coupon code already exists");

    const coupon = CouponEntity.create(
      data.code,
      data.type,
      data.value,
      data.minOrderAmount,
      data.maxDiscount,
      data.usageLimit,
      new Date(data.startDate),
      new Date(data.endDate),
      data.applicableCategories || [],
      data.applicableProducts || []
    );

    return await this.couponRepository.create(coupon);
  }

  async validateAndApplyCoupon(
    code: string,
    orderAmount: number,
    productIds: string[],
    categoryIds: string[]
  ): Promise<{
    valid: boolean;
    discount: number;
    reason?: string;
    coupon?: CouponEntity;
  }> {
    const coupon = await this.couponRepository.findByCode(code);

    if (!coupon) {
      return { valid: false, discount: 0, reason: "Invalid coupon code" };
    }

    const validationResult = coupon.isValid(orderAmount);
    if (!validationResult.valid) {
      return { valid: false, discount: 0, reason: validationResult.reason };
    }

    // Check category/product applicability
    if (coupon.applicableCategories.length > 0) {
      const hasApplicableCategory = categoryIds.some((cid) =>
        coupon.canBeAppliedToCategory(cid)
      );
      if (!hasApplicableCategory) {
        return {
          valid: false,
          discount: 0,
          reason: "Coupon not applicable to these products",
        };
      }
    }

    if (coupon.applicableProducts.length > 0) {
      const hasApplicableProduct = productIds.some((pid) =>
        coupon.canBeAppliedToProduct(pid)
      );
      if (!hasApplicableProduct) {
        return {
          valid: false,
          discount: 0,
          reason: "Coupon not applicable to these products",
        };
      }
    }

    const discount = coupon.calculateDiscount(orderAmount);
    return { valid: true, discount, coupon };
  }

  async getCouponById(id: string): Promise<CouponEntity | null> {
    return await this.couponRepository.findById(id);
  }

  async getAllCoupons(
    page: number,
    limit: number
  ): Promise<{ coupons: CouponEntity[]; total: number }> {
    return await this.couponRepository.findAll(page, limit);
  }

  async updateCoupon(
    id: string,
    data: Partial<CouponEntity>
  ): Promise<CouponEntity | null> {
    return await this.couponRepository.update(id, data);
  }

  async deleteCoupon(id: string): Promise<boolean> {
    return await this.couponRepository.delete(id);
  }
}
