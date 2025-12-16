import { CouponType } from "@/shared/types/common.types";

export class CouponEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly type: CouponType,
    public readonly value: number,
    public readonly minOrderAmount: number,
    public readonly maxDiscount: number,
    public readonly usageLimit: number,
    public readonly usedCount: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly isActive: boolean = true,
    public readonly applicableCategories: string[] = [],
    public readonly applicableProducts: string[] = [],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  public isValid(
    orderAmount: number,
    currentDate: Date = new Date()
  ): { valid: boolean; reason?: string } {
    if (!this.isActive) return { valid: false, reason: "Coupon is inactive" };
    if (currentDate < this.startDate)
      return { valid: false, reason: "Coupon not yet active" };
    if (currentDate > this.endDate)
      return { valid: false, reason: "Coupon expired" };
    if (this.usedCount >= this.usageLimit)
      return { valid: false, reason: "Usage limit reached" };
    if (orderAmount < this.minOrderAmount)
      return {
        valid: false,
        reason: `Minimum order amount is ${this.minOrderAmount}`,
      };
    return { valid: true };
  }

  public calculateDiscount(orderAmount: number): number {
    if (this.type === CouponType.PERCENTAGE) {
      const discount = (orderAmount * this.value) / 100;
      return Math.min(discount, this.maxDiscount);
    }
    return Math.min(this.value, orderAmount);
  }

  public canBeAppliedToCategory(categoryId: string): boolean {
    if (this.applicableCategories.length === 0) return true;
    return this.applicableCategories.includes(categoryId);
  }

  public canBeAppliedToProduct(productId: string): boolean {
    if (this.applicableProducts.length === 0) return true;
    return this.applicableProducts.includes(productId);
  }

  public static create(
    code: string,
    type: CouponType,
    value: number,
    minOrderAmount: number,
    maxDiscount: number,
    usageLimit: number,
    startDate: Date,
    endDate: Date,
    applicableCategories: string[] = [],
    applicableProducts: string[] = []
  ): CouponEntity {
    return new CouponEntity(
      "",
      code.toUpperCase(),
      type,
      value,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      0,
      startDate,
      endDate,
      true,
      applicableCategories,
      applicableProducts
    );
  }
}
