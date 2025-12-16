import { model, Schema } from "mongoose";

const ProductVariantSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
    basePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: true }
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    basePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true, index: true },
    variants: [ProductVariantSchema],
    images: [{ type: String }],
    ingredients: [{ type: String }],
    nutritionInfo: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text" });

export const ProductModel = model("Product", ProductSchema);
