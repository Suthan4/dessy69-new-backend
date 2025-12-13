import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: {
    productId: Types.ObjectId;
    productName: string;
    quantity: number;
    basePrice: number;
    variant?: {
      name?: string;
      additionalPrice?: number;
      isAvailable?: boolean;
    };
    totalPrice: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";
  paymentId: string;
  couponCode?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IOrderDocument = HydratedDocument<IOrder>;

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        basePrice: { type: Number, required: true },
        variant: {
          name: String,
          additionalPrice: Number,
          isAvailable: Boolean,
        },
        totalPrice: { type: Number, required: true },
      },
    ],
    subtotal: Number,
    discount: Number,
    total: Number,
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ],
    },
    paymentId: String,
    couponCode: String,
    cancelReason: String,
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
