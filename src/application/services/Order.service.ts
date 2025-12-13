import { OrderRepository } from "@/infrastructure/database/repositories/OrderRepository";
import {
  CreateOrderDTO,
  OrderResponseDTO,
  OrderStatisticsDTO,
} from "../dtos/OrderDTO";
import { IOrderService } from "../interface/IService";
import { CouponRepository } from "@/infrastructure/database/repositories/CouponRepository";
import { OrderServiceMapper } from "../mappers/OrderServiceMapper";
import { Order, OrderItem, OrderStatus } from "@/domain/entities/Order.entity";
import { ObjectId } from "mongodb";

export class OrderService implements IOrderService {
  constructor(
    private orderRepository: OrderRepository,
    private couponRepository: CouponRepository
  ) {}
  async createOrder(
    userId: string,
    orderData: CreateOrderDTO
  ): Promise<OrderResponseDTO> {
    let discount = 0;

    if (orderData.couponCode) {
      const coupon = await this.couponRepository.findByCode(
        orderData.couponCode
      );
      if (coupon && coupon.canBeUsed(orderData.subtotal)) {
        discount = coupon.calculateDiscount(orderData.subtotal);
        await this.couponRepository.incerementUsage(coupon.id);
      }
    }

    const items = orderData.items.map(
      (item) =>
        new OrderItem(
          item.productId,
          item.productName,
          item.quantity,
          item.basePrice,
          item.variant,
          item.totalPrice
        )
    );

    const order = new Order(
      "",
      new ObjectId(userId),
      items,
      orderData.subtotal,
      discount,
      orderData.subtotal - discount,
      OrderStatus.PENDING,
      orderData.paymentId,
      orderData.couponCode || null,
      orderData.cancelReason || null,
      new Date(),
      new Date()
    );

    const created = await this.orderRepository.create(order);
    return OrderServiceMapper.mapToDTO(created);
  }

  async getOrderById(id: string): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new Error("Order not found");
    return OrderServiceMapper.mapToDTO(order);
  }

  async getUserOrders(userId: string): Promise<OrderResponseDTO[]> {
    const orders = await this.orderRepository.findByUserId(userId);
    return orders.map((o) => OrderServiceMapper.mapToDTO(o));
  }

  async getAllOrders(): Promise<OrderResponseDTO[]> {
    const orders = await this.orderRepository.findAll();
    return orders.map((o) => OrderServiceMapper.mapToDTO(o));
  }

  async updateOrderStatus(
    id: string,
    status: string
  ): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new Error("Order not found");

    order.updateStatus(status as OrderStatus);
    const updated = await this.orderRepository.updateStatus(
      id,
      status as OrderStatus
    );
    if (!updated) throw new Error("Failed to update order");
    return OrderServiceMapper.mapToDTO(updated);
  }

  async cancelOrder(id: string, reason: string): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new Error("Order not found");

    order.cancelReason = reason;
    const updated = await this.orderRepository.update(id, {
      status: OrderStatus.CANCELLED,
      cancelReason: reason,
    } as Order);

    if (!updated) throw new Error("Failed to cancel order");
    return OrderServiceMapper.mapToDTO(updated);
  }

  async getTodayOrders(): Promise<OrderResponseDTO[]> {
    const orders = await this.orderRepository.getTodayIOrders();
    return orders.map((o) => OrderServiceMapper.mapToDTO(o));
  }

  async getOrderStatistics(
    startDate: Date,
    endDate: Date
  ): Promise<OrderStatisticsDTO[]> {
    return await this.orderRepository.getIOrderStatistics(startDate, endDate);
  }
}
