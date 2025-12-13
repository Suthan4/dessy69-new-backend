import { DiscountType } from "@/domain/entities/Coupon.entity";

export interface CreateCouponDTO {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number | null;
  isActive?: boolean;
  expiresAt?: Date | null;
  usageLimit?: number | null;
}

export interface UpdateCouponDTO {
  code?: string;
  discountType?: DiscountType;
  discountValue?: number;
  minOrderAmount?: number;
  maxDiscount?: number | null;
  isActive?: boolean;
  expiresAt?: Date | null;
  usageLimit?: number | null;
}

export interface CouponResponseDTO {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  isActive: boolean;
  expiresAt: Date | null;
  usageLimit: number | null;
  usedCount: number;
  createdAt: Date;
}

export interface CouponValidationDTO {
  valid: boolean;
  message?: string;
  discount?: number;
  finalAmount?: number;
  couponCode?: string;
}
