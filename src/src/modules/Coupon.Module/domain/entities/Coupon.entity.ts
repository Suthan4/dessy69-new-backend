export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}
export class Coupon {
  constructor(
    public readonly id: string,
    public code: string,
    public discountType: DiscountType,
    public discountValue: number,
    public minOrderAmount: number,
    public maxDiscount: number | null,
    public isActive: boolean,
    public expiresAt: Date | null,
    public usageLimit: number | null,
    public usedCount: number,
    public createdAt: Date
  ) {}

  canBeUsed(orderAmount: number): boolean {
    if (!this.isActive) return false;
    if (this.expiresAt && new Date() > this.expiresAt) return false;
    if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
    if (orderAmount < this.minOrderAmount) return false;
    return true;
  }

  calculateDiscount(orderAmount: number): number {
    if (!this.canBeUsed(orderAmount)) return 0;

    let discount = 0;
    if (this.discountType === DiscountType.PERCENTAGE) {
      discount = (orderAmount * this.discountValue) / 100;
      if (this.maxDiscount) {
        discount = Math.min(discount, this.maxDiscount);
      }
    } else {
      discount = this.discountValue;
    }

    return Math.min(discount, orderAmount);
  }
  incrementUsage(): void {
    this.usedCount += 1;
  }
}
