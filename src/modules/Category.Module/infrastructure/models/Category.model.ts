import { model, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    path: { type: String, required: true, index: true }, // Index for fast queries
    description: { type: String },
    parentId: { type: Schema.Types.ObjectId, ref: "Category" },
    level: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryModel = model("Category", CategorySchema);
