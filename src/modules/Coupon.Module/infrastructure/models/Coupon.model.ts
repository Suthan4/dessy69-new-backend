import { CouponType } from "@/shared/types/common.types";
import { model, Schema, Types } from "mongoose";

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    type: { type: String, enum: Object.values(CouponType), required: true },
    value: { type: Number, required: true },
    minOrderAmount: { type: Number, required: true, default: 0 },
    maxDiscount: { type: Number, required: true },
    usageLimit: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export const CouponModel = model("Coupon", CouponSchema);
