import mongoose, { HydratedDocument, Schema } from "mongoose";
export interface Product extends Document {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  image: string;
  variants: Array<{
    name: string;
    additionalPrice: number;
    isAvailable: boolean;
  }>;
  isAvailable: boolean;
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export type IProductDocument = HydratedDocument<Product>;

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    basePrice: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    variants: [
      {
        name: { type: String, required: true },
        additionalPrice: { type: Number, required: true, default: 0 },
        isAvailable: { type: Boolean, default: true },
      },
    ],
    isAvailable: { type: Boolean, default: true, index: true },
    isPopular: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ category: 1, isAvailable: 1 });

export const ProductModel = mongoose.model<IProductDocument>(
  "Product",
  ProductSchema
);
