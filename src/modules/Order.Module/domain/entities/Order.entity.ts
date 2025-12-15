import { Types } from "mongoose";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface TrackingHistoryEntry {
  status: OrderStatus;
  timestamp: Date;
  notes?: string;
}

export class Order {
  constructor(
    public readonly id: string,
    public orderId: string,
    public customerDetails: CustomerDetails,
    public items: OrderItem[],
    public subtotal: number,
    public discount: number,
    public total: number,
    public status: OrderStatus,
    public paymentStatus: PaymentStatus,
    public paymentId: string | undefined,
    public razorpayOrderId: string | undefined,
    public razorpayPaymentId: string | undefined,
    public razorpaySignature: string | undefined,
    public couponCode: string | null,
    public notes: string | undefined,
    public estimatedTime: number | undefined,
    public trackingHistory: TrackingHistoryEntry[],
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  updateStatus(newStatus: OrderStatus, notes?: string): void {
    this.status = newStatus;
    this.trackingHistory.push({
      status: newStatus,
      timestamp: new Date(),
      ...(notes !== undefined && { notes }),
    });
    this.updatedAt = new Date();
  }

  updatePaymentStatus(
    status: PaymentStatus,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): void {
    this.paymentStatus = status;
    this.razorpayOrderId = razorpayOrderId;
    this.razorpayPaymentId = razorpayPaymentId;
    this.razorpaySignature = razorpaySignature;
    this.updatedAt = new Date();
  }

  cancel(reason: string): void {
    if (this.status === OrderStatus.DELIVERED) {
      throw new Error("Cannot cancel delivered order");
    }
    this.status = OrderStatus.CANCELLED;
    this.notes = reason;
    this.trackingHistory.push({
      status: OrderStatus.CANCELLED,
      timestamp: new Date(),
      notes: reason,
    });
    this.updatedAt = new Date();
  }
}

export class OrderItem {
  constructor(
    public menuItemId: Types.ObjectId,
    public name: string,
    public variantName: string,
    public price: number,
    public quantity: number,
    public totalPrice: number
  ) {}
}
