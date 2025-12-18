import { OrderStatus, PaymentStatus } from "@/shared/types/common.types";

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export class OrderEntity {
  constructor(
    public readonly id: string,
    public readonly items: OrderItem[],
    public readonly subtotal: number,
    public readonly discount: number,
    public readonly deliveryCharge: number,
    public readonly total: number,
    public readonly status: OrderStatus,
    public readonly paymentStatus: PaymentStatus,
    public readonly phone: string,
    public readonly couponCode?: string,
    public readonly deliveryAddress?: string,
    public readonly userId?: string,
    public readonly notes?: string,
    public readonly razorpayOrderId?: string,
    public readonly razorpayPaymentId?: string,
    public readonly statusHistory: Array<{
      status: OrderStatus;
      timestamp: Date;
      note?: string;
    }> = [],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  public canBeCancelled(): boolean {
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(this.status);
  }

  public canBeUpdated(): boolean {
    return ![OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(
      this.status
    );
  }

  public addStatusChange(status: OrderStatus, note?: string): void {
    this.statusHistory.push({ status, timestamp: new Date(), note });
  }

  public static create(
    userId: string,
    items: OrderItem[],
    deliveryAddress: string,
    phone: string,
    couponCode?: string,
    discount: number = 0,
    notes?: string
  ): OrderEntity {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const deliveryCharge = subtotal > 500 ? 0 : 50;
    const total = subtotal - discount + deliveryCharge;

    return new OrderEntity(
      "",
      items,
      subtotal,
      discount,
      deliveryCharge,
      total,
      OrderStatus.PENDING,
      PaymentStatus.PENDING,
      phone,
      couponCode,
      deliveryAddress,
      userId,
      notes,
      undefined,
      undefined,
      [{ status: OrderStatus.PENDING, timestamp: new Date() }]
    );
  }
}
