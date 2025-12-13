import { OrderStatus } from "@/domain/entities/Order.entity";
import { ProductVariant } from "@/domain/entities/Product.entity";
import { Types } from "mongoose";

export interface OrderItemDTO {
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  basePrice: number;
  variant: ProductVariant | null;
  totalPrice: number;
}

export interface CreateOrderDTO {
  items: OrderItemDTO[];
  subtotal: number;
  paymentId: string;
  couponCode?: string;
  cancelReason?: string;
}

export interface OrderResponseDTO {
  id: string;
  userId: Types.ObjectId;
  items: OrderItemDTO[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentId: string;
  couponCode: string | null;
  cancelReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderStatisticsDTO {
  status: OrderStatus;
  count: number;
  totalRevenue: number;
}
