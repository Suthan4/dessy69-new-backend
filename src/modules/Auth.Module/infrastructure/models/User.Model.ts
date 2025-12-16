import { UserRole } from "@/shared/types/common.types";
import { Schema, Document, model } from "mongoose";

export interface IUserDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  isActive: boolean;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
      required: true,
    },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const UserModel = model<IUserDocument>("User", UserSchema);
