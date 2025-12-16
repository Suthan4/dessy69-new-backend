import { OrderStatus, PaymentStatus } from "@/shared/types/common.types";
import { model, Schema } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    variantId: { type: String },
    variantName: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

const StatusHistorySchema = new Schema(
  {
    status: { type: String, enum: Object.values(OrderStatus), required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
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
    },
    couponCode: { type: String },
    deliveryAddress: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    statusHistory: [StatusHistorySchema],
  },
  { timestamps: true }
);

export const OrderModel = model("Order", OrderSchema);
