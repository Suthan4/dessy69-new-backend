import mongoose, { HydratedDocument, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ICategoryDocument = HydratedDocument<ICategory>;

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model<ICategory>(
  "Category",
  CategorySchema
);
