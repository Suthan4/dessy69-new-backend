import mongoose, { HydratedDocument, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  image: string;

  // Product-level pricing (required)
  basePrice: number;
  sellingPrice: number;

  variants: Array<{
    name: string;
    basePrice: number; // Original/MRP price
    sellingPrice: number; // Actual selling price (after discount)
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

    // Product-level pricing (required)
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
      // validate: {
      //   validator: function (value: number) {
      //     const basePrice = (this as any).basePrice;
      //     if (basePrice && value) {
      //       return value <= basePrice;
      //     }
      //     return true;
      //   },
      //   message: "Selling price cannot be greater than base price",
      // },
    },

    variants: {
      type: [
        {
          name: { type: String, required: true },
          basePrice: {
            type: Number,
            required: true,
            min: 0,
          },
          sellingPrice: {
            type: Number,
            required: true,
            min: 0,
            // validate: {
            //   validator: function (value: number) {
            //     // @ts-ignore - Access parent array item
            //     return value <= this.basePrice;
            //   },
            //   message:
            //     "Variant selling price cannot be greater than base price",
            // },
          },
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

// Indexes
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ categoryId: 1, isAvailable: 1 });
ProductSchema.index({ sellingPrice: 1 });


export const ProductModel = mongoose.model<IProductDocument>(
  "Product",
  ProductSchema
);