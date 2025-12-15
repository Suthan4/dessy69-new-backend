
import { CustomerDetails, OrderStatus, PaymentStatus } from "@/modules/Order.Module/domain/entities/Order.entity";
import { Types } from "mongoose";

export interface OrderItemDTO {
  menuItemId: Types.ObjectId;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface CreateOrderDTO {
  customerDetails: CustomerDetails;
  items: OrderItemDTO[];
  couponCode?: string;
  notes?: string;
}

export interface OrderResponseDTO {
  id: string;
  orderId: string;
  customerDetails: CustomerDetails;
  items: OrderItemDTO[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  couponCode?: string | null;
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

export interface OrderStatisticsDTO {
  status: OrderStatus;
  count: number;
  totalRevenue: number;
}
