import { Coupon } from "@/domain/entities/Coupon.entity";
import { ICouponRepository } from "@/domain/interfaces/ICouponRepository";
import { CouponModel } from "../models/Coupon.model";
import { CouponMapper } from "../mappers/Coupon.mapper";

export class CouponRepository implements ICouponRepository {
  async findByCode(code: string): Promise<Coupon | null> {
    const doc = await CouponModel.findOne({ code: code.toUpperCase() });
    return doc ? CouponMapper.mapToEntity(doc) : null;
  }
  async findActive(): Promise<Coupon[]> {
    const docs = await CouponModel.find({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    });
    return docs.map((doc) => CouponMapper.mapToEntity(doc));
  }
  async incerementUsage(id: string): Promise<boolean> {
    const result = await CouponModel.findByIdAndUpdate(id, {
      $inc: { usedCount: 1 },
    });
    return !!result;
  }
  async create(entity: Coupon): Promise<Coupon> {
    const persistenceData = CouponMapper.toPersistence(entity);
    const doc = new CouponModel(persistenceData);
    await doc.save();

    return CouponMapper.mapToEntity(doc);
  }
  async findAll(): Promise<Coupon[]> {
    const docs = await CouponModel.find().sort({ createdAt: -1 });
    return docs.map((doc) => CouponMapper.mapToEntity(doc));
  }
  async findById(id: string): Promise<Coupon | null> {
    const doc = await CouponModel.findById(id);
    return doc ? CouponMapper.mapToEntity(doc) : null;
  }
  async update(id: string, payload: Partial<Coupon>): Promise<Coupon | null> {
    const doc = await CouponModel.findByIdAndUpdate(
      id,
      {
        payload,
        updatedAt: new Date(),
      },
      { new: true }
    );
    return doc ? CouponMapper.mapToEntity(doc) : null;
  }
  async delete(id: string): Promise<boolean> {
    const result = CouponModel.findByIdAndDelete(id);
    return !!result;
  }
}
