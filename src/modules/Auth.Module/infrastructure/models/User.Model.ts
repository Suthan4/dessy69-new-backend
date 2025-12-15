import { UserRole } from "@/modules/Auth.Module/domain/entities/User.entity";
import mongoose, { HydratedDocument, Schema } from "mongoose";

export interface IUser {
  email: string;
  name: string;
  phone: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserDocument = HydratedDocument<IUser>;

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
      index: true,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
