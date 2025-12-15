import { Order, OrderStatus } from "../entities/Order.entity";
import { IRepository } from "./IRepository";

export interface IOrderRepository extends IRepository<Order> {
  findByOrderId(orderId: string): Promise<Order | null>;
  findByCustomerPhone(phone: string): Promise<Order[]>;
  findByStatus(status: OrderStatus): Promise<Order[]>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
  getTodayIOrders(): Promise<Order[]>;
  getIOrderStatistics(startDate: Date, endDate: Date): Promise<any>;
}
