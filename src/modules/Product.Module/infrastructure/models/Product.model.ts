import mongoose, { HydratedDocument, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  image: string;
  variants: Array<{
    name: string;
    price: number;
    isAvailable: boolean;
  }>;
  isAvailable: boolean;
  popularity: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type IProductDocument = HydratedDocument<IProduct>;

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    image: { type: String, required: true },
    variants: {
      type: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true, min: 0 },
          isAvailable: { type: Boolean, default: true },
        },
      ],
      required: true,
      validate: [
        (val: any[]) => val.length > 0,
        "At least one variant is required",
      ],
    },
    isAvailable: { type: Boolean, default: true, index: true },
    popularity: { type: Number, default: 0, min: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ categoryId: 1, isAvailable: 1 });

export const ProductModel = mongoose.model<IProductDocument>(
  "Product",
  ProductSchema
);
