import { model, models, Schema } from "mongoose";

// Ingredient sub-schema
const IngredientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: String },
    isOptional: { type: Boolean, required: true },
    additionalPrice: { type: Number, default: 0 },
    allergens: [{ type: String }],
  },
  { _id: true }
);

// Product variant sub-schema
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

// Main product schema
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
    ingredients: [IngredientSchema], // now an array of objects
    nutritionInfo: { type: Map, of: Object }, // dynamic keys like per100ml, perServing
  },
  { timestamps: true }
);

// Full-text index
ProductSchema.index({ name: "text", description: "text" });

export const ProductModel = model("Product", ProductSchema);
