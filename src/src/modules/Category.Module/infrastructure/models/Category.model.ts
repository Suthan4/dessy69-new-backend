import mongoose, { HydratedDocument, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId: mongoose.Types.ObjectId | null;
  level: number;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ICategoryDocument = HydratedDocument<ICategory>;

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    level: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },
    path: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient hierarchical queries
CategorySchema.index({ parentId: 1, level: 1 });
CategorySchema.index({ path: 1 });
CategorySchema.index({ isActive: 1, level: 1 });

export const CategoryModel = mongoose.model<ICategory>(
  "Category",
  CategorySchema
);