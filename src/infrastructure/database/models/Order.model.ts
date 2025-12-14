import mongoose, { HydratedDocument, Schema } from "mongoose";
import { OrderStatus, PaymentStatus } from "@/domain/entities/Order.entity";

export interface IOrder extends Document {
  orderId: string;
  customerDetails: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  items: Array<{
    menuItemId: mongoose.Types.ObjectId;
    name: string;
    variantName: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  couponCode?: string;
  notes?: string;
  estimatedTime?: number;
  trackingHistory: Array<{
    status: OrderStatus;
    timestamp: Date;
    notes?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export type IOrderDocument = HydratedDocument<IOrder>;

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String },
    },
    items: [
      {
        menuItemId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        variantName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    couponCode: { type: String },
    notes: { type: String },
    estimatedTime: { type: Number },
    trackingHistory: {
      type: [
        {
          status: {
            type: String,
            enum: Object.values(OrderStatus),
            required: true,
          },
          timestamp: { type: Date, required: true },
          notes: { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

OrderSchema.index({ orderId: 1 });
OrderSchema.index({ "customerDetails.phone": 1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });


export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
