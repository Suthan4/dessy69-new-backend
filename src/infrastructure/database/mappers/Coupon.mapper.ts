import { Coupon, DiscountType } from "@/domain/entities/Coupon.entity";
import { ICouponDocument } from "../models/Coupon.model";

export class CouponMapper {
  static mapToEntity(doc: ICouponDocument): Coupon {
    return new Coupon(
      doc._id.toString(),
      doc.code,
      doc.discountType as DiscountType,
      doc.discountValue,
      doc.minOrderAmount,
      doc.maxDiscount ?? null,
      doc.isActive,
      doc.expiresAt ?? null,
      doc.usageLimit ?? null,
      doc.usedCount,
      doc.createdAt
    );
  }
   static toPersistence(entity: Coupon) {
    const data: any = {
      code: entity.code,
      discountType: entity.discountType,
      discountValue: entity.discountValue,
      minOrderAmount: entity.minOrderAmount,
      isActive: entity.isActive,
      usedCount: entity.usedCount,
    };

    // Only include optional fields if they have values
    if (entity.maxDiscount !== null && entity.maxDiscount !== undefined) {
      data.maxDiscount = entity.maxDiscount;
    }

    if (entity.expiresAt !== null && entity.expiresAt !== undefined) {
      data.expiresAt = entity.expiresAt;
    }

    if (entity.usageLimit !== null && entity.usageLimit !== undefined) {
      data.usageLimit = entity.usageLimit;
    }

    return data;
  }
}
