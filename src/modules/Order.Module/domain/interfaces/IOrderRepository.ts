import { OrderStatus, PaymentStatus } from "@/shared/types/common.types";
import { OrderEntity } from "../entities/Order.entity";

export interface IOrderRepository {
  create(order: OrderEntity): Promise<OrderEntity>;
  findById(id: string): Promise<OrderEntity | null>;
  findByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ orders: OrderEntity[]; total: number }>;
  findAll(
    page: number,
    limit: number,
    filters?: any
  ): Promise<{ orders: OrderEntity[]; total: number }>;
  updateStatus(
    id: string,
    status: OrderStatus,
    note?: string
  ): Promise<OrderEntity | null>;
  updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
    razorpayPaymentId?: string
  ): Promise<OrderEntity | null>;
  update(id: string, data: Partial<OrderEntity>): Promise<OrderEntity | null>;
}
