// import mongoose, { HydratedDocument, Schema } from "mongoose";

// export interface ICategory extends Document {
//   name: string;
//   description?: string;
//   image?: string;
//   isActive: boolean;
//   path: string;
//   parentId: mongoose.Types.ObjectId | null;
//   level: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export type ICategoryDocument = HydratedDocument<ICategory>;

// const CategorySchema = new Schema<ICategory>(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     image: {
//       type: String,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//       index: true,
//     },
//     path: {
//       type: String,
//       index: true,
//       unique: true,
//     },
//     parentId: {
//       type: Schema.Types.ObjectId,
//       ref: "Category",
//       default: null,
//       index: true,
//     },
//     level: {
//       type: Number,
//       required: true,
//       default: 0,
//       min: 0,
//       index: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// CategorySchema.index({ path: 1, level: 1 });
// CategorySchema.index({ parentId: 1, isActive: 1 });
// CategorySchema.index({ name: "text", description: "text" });

// export const CategoryModel = mongoose.model<ICategory>(
//   "Category",
//   CategorySchema
// );
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