import { ProductVariant } from "./Product.entity";
import {Types} from "mongoose";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export class Order {
  constructor(
    public readonly id: string,
    public userId: Types.ObjectId,
    public items: OrderItem[],
    public subtotal: number,
    public discount: number,
    public total: number,
    public status: OrderStatus,
    public paymentId: string,
    public couponCode: string | null,
    public cancelReason: string | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  updateStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  cancel(reason: string): void {
    if (this.status === OrderStatus.COMPLETED) {
      throw new Error("Cannot cancel completed order");
    }
    this.status = OrderStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  calculateTotal(): void {
    this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.total = this.subtotal - this.discount;
  }
}

export class OrderItem {
  constructor(
    public productId: Types.ObjectId,
    public productName: string,
    public quantity: number,
    public basePrice: number,
    public variant: ProductVariant | null,
    public totalPrice: number
  ) {}
}