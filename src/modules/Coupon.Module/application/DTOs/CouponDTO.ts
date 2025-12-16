import {
  DiscountType,
  CouponApplicability,
  CouponEligibility,
  CouponRestrictions,
  CouponMetadata,
} from "@/modules/Coupon.Module/domain/entities/Coupon.entity";

export interface CreateCouponDTO {
  code: string;
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number | null;
  isActive?: boolean;
  expiresAt?: Date | null;
  usageLimit?: number | null;
  usagePerCustomer?: number | null;
  applicability: CouponApplicability;
  eligibility: CouponEligibility;
  restrictions?: CouponRestrictions;
  metadata?: CouponMetadata;
}

export interface UpdateCouponDTO {
  title?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  minOrderAmount?: number;
  maxDiscount?: number | null;
  isActive?: boolean;
  expiresAt?: Date | null;
  usageLimit?: number | null;
  usagePerCustomer?: number | null;
  eligibility?: CouponEligibility;
  restrictions?: CouponRestrictions;
  metadata?: CouponMetadata;
}

export interface CouponResponseDTO {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  isActive: boolean;
  expiresAt: Date | null;
  usageLimit: number | null;
  usagePerCustomer: number | null;
  usedCount: number;
  applicability: CouponApplicability;
  eligibility: CouponEligibility;
  restrictions: CouponRestrictions;
  metadata: CouponMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface ValidateCouponRequest {
  code: string;
  orderAmount: number;
  customerId?: string;
  items: CouponValidationItem[];
}

export interface CouponValidationItem {
  productId: string;
  categoryId: string;
  categoryPath: string[];
  amount: number;
}

export interface CouponValidationResponse {
  valid: boolean;
  message?: string;
  discount?: number;
  eligibleAmount?: number;
  finalAmount?: number;
  couponCode?: string;
  appliedCategories?: string[];
  appliedProducts?: string[];
}
