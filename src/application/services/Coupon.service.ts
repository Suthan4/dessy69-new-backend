import { ICouponRepository } from "../../domain/interfaces/ICouponRepository";
import { Coupon, DiscountType } from "../../domain/entities/Coupon.entity";
import {
  CreateCouponDTO,
  UpdateCouponDTO,
  CouponResponseDTO,
  CouponValidationDTO,
} from "../dtos/CouponDTO";
import { ICouponService } from "../interface/IService";

export class CouponService implements ICouponService {
  constructor(private couponRepository: ICouponRepository) {}

  async createCoupon(data: CreateCouponDTO): Promise<CouponResponseDTO> {
    const coupon = new Coupon(
      "",
      data.code.toUpperCase(),
      data.discountType,
      data.discountValue,
      data.minOrderAmount || 0,
      data.maxDiscount || null,
      data.isActive ?? true,
      data.expiresAt || null,
      data.usageLimit || null,
      0,
      new Date()
    );

    const created = await this.couponRepository.create(coupon);
    return this.mapToDTO(created);
  }

  async getAllCoupons(): Promise<CouponResponseDTO[]> {
    const coupons = await this.couponRepository.findAll();
    return coupons.map((c) => this.mapToDTO(c));
  }

  async getCouponByCode(code: string): Promise<CouponResponseDTO> {
    const coupon = await this.couponRepository.findByCode(code);
    if (!coupon) throw new Error("Coupon not found");
    return this.mapToDTO(coupon);
  }

  async validateCoupon(
    code: string,
    orderAmount: number
  ): Promise<CouponValidationDTO> {
    const coupon = await this.couponRepository.findByCode(code);

    if (!coupon) {
      return { valid: false, message: "Coupon not found" };
    }

    if (!coupon.canBeUsed(orderAmount)) {
      return {
        valid: false,
        message: this.getInvalidReason(coupon, orderAmount),
      };
    }

    const discount = coupon.calculateDiscount(orderAmount);

    return {
      valid: true,
      discount,
      finalAmount: orderAmount - discount,
      couponCode: coupon.code,
    };
  }

  async applyCoupon(code: string, orderAmount: number): Promise<number> {
    const coupon = await this.couponRepository.findByCode(code);
    if (!coupon || !coupon.canBeUsed(orderAmount)) {
      throw new Error("Invalid or expired coupon");
    }
    return coupon.calculateDiscount(orderAmount);
  }

  async updateCoupon(
    id: string,
    data: UpdateCouponDTO
  ): Promise<CouponResponseDTO> {
    const updated = await this.couponRepository.update(
      id,
      data as Partial<Coupon>
    );
    if (!updated) throw new Error("Coupon not found");
    return this.mapToDTO(updated);
  }

  async deleteCoupon(id: string): Promise<boolean> {
    return await this.couponRepository.delete(id);
  }

  private getInvalidReason(coupon: Coupon, orderAmount: number): string {
    if (!coupon.isActive) return "Coupon is inactive";
    if (coupon.expiresAt && new Date() > coupon.expiresAt)
      return "Coupon has expired";
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return "Coupon usage limit reached";
    }
    if (orderAmount < coupon.minOrderAmount) {
      return `Minimum order amount is ₹${coupon.minOrderAmount}`;
    }
    return "Coupon cannot be applied";
  }

  private mapToDTO(coupon: Coupon): CouponResponseDTO {
    return {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount,
      isActive: coupon.isActive,
      expiresAt: coupon.expiresAt,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      createdAt: coupon.createdAt,
    };
  }
}
