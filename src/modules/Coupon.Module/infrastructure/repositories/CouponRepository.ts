import { CouponEntity } from "../../domain/entities/Coupon.entity";
import { ICouponRepository } from "../../domain/interfaces/ICouponRepository";
import { CouponModel } from "../models/Coupon.model";

export class CouponRepository implements ICouponRepository {
  async create(coupon: CouponEntity): Promise<CouponEntity> {
    const doc = await CouponModel.create({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      isActive: coupon.isActive,
      applicableCategories: coupon.applicableCategories,
      applicableProducts: coupon.applicableProducts,
    });
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<CouponEntity | null> {
    const doc = await CouponModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findByCode(code: string): Promise<CouponEntity | null> {
    const doc = await CouponModel.findOne({ code: code.toUpperCase() });
    return doc ? this.toEntity(doc) : null;
  }

  async update(
    id: string,
    data: Partial<CouponEntity>
  ): Promise<CouponEntity | null> {
    const doc = await CouponModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.toEntity(doc) : null;
  }

  async incrementUsage(id: string): Promise<void> {
    await CouponModel.findByIdAndUpdate(id, { $inc: { usedCount: 1 } });
  }

  async delete(id: string): Promise<boolean> {
    const result = await CouponModel.findByIdAndDelete(id);
    return !!result;
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ coupons: CouponEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      CouponModel.find().skip(skip).limit(limit),
      CouponModel.countDocuments(),
    ]);
    return { coupons: docs.map((d) => this.toEntity(d)), total };
  }

  private toEntity(doc: any): CouponEntity {
    return new CouponEntity(
      doc._id.toString(),
      doc.code,
      doc.type,
      doc.value,
      doc.minOrderAmount,
      doc.maxDiscount,
      doc.usageLimit,
      doc.usedCount,
      doc.startDate,
      doc.endDate,
      doc.isActive,
      doc.applicableCategories.map((c: any) => c.toString()),
      doc.applicableProducts.map((p: any) => p.toString()),
      doc.createdAt,
      doc.updatedAt
    );
  }
}
