
import { OrderRepository } from "@/modules/Order.Module/infrastructure/repositories/OrderRepository";
import { IOrderService } from "../interface/IOrderService";
import { OrderServiceMapper } from "../mappers/OrderServiceMapper";
import { CouponRepository } from "@/modules/Coupon.Module/infrastructure/repositories/CouponRepository";
import { ProductRepository } from "@/modules/Product.Module/infrastructure/repositories/ProductRepository";
import { CreateOrderDTO, OrderResponseDTO, OrderStatisticsDTO } from "../DTOs/OrderDTO";
import { Order, OrderItem, OrderStatus, PaymentStatus } from "@/modules/Order.Module/domain/entities/Order.entity";
import { SocketManager } from "@/shared/infrastructure/SocketManager";


export class OrderService implements IOrderService {
  constructor(
    private orderRepository: OrderRepository,
    private couponRepository: CouponRepository,
    private productRepository: ProductRepository
  ) {}

  private generateOrderId(): string {
    const prefix = "DESSY";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  async createOrder(orderData: CreateOrderDTO): Promise<OrderResponseDTO> {
    let subtotal = 0;
    const items: OrderItem[] = [];

    // Validate items and calculate subtotal
    for (const item of orderData.items) {
      const product = await this.productRepository.findById(
        item.menuItemId.toString()
      );

      if (!product || !product.isAvailable) {
        throw new Error(`Product ${item.name} is not available`);
      }

      const variant = product.variants.find((v:any) => v.name === item.variantName);
      if (!variant || !variant.isAvailable) {
        throw new Error(`Variant ${item.variantName} is not available`);
      }

      const totalItem = item.sellingPrice+variant.sellingPrice * item.quantity;
      subtotal += totalItem;

      items.push(
        new OrderItem(
          item.menuItemId,
          item.name,
          item.variantName,
          item.basePrice,
          item.sellingPrice,
          variant.basePrice,
          variant.sellingPrice,
          item.quantity,
          totalItem
        )
      );

      // Increment product popularity
      await this.productRepository.incrementPopularity(product.id);
    }

    // Apply coupon if provided
    let discount = 0;
    if (orderData.couponCode) {
      const coupon = await this.couponRepository.findByCode(
        orderData.couponCode
      );
      if (!coupon || !coupon.canBeUsed(subtotal)) {
        throw new Error("Invalid or expired coupon");
      }
      discount = coupon.calculateDiscount(subtotal);
    }

    const total = subtotal - discount;
    const orderId = this.generateOrderId();

    const order = new Order(
      "",
      orderId,
      orderData.customerDetails,
      items,
      subtotal,
      discount,
      total,
      OrderStatus.PENDING,
      PaymentStatus.PENDING,
      undefined,
      undefined,
      undefined,
      undefined,
      orderData.couponCode || null,
      orderData.notes,
      undefined,
      [
        {
          status: OrderStatus.PENDING,
          timestamp: new Date(),
          notes: "Order created",
        },
      ],
      new Date(),
      new Date()
    );

    const created = await this.orderRepository.create(order);
    const dto = OrderServiceMapper.mapToDTO(created);

    // Emit socket events
    const socketManager = SocketManager.getInstance();
    socketManager.emitToAdmins("order:new", dto);
    socketManager.broadcast("order:created", { orderId: created.orderId });

    return dto;
  }

  async getOrderById(id: string): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new Error("Order not found");
    return OrderServiceMapper.mapToDTO(order);
  }

  async getOrderByOrderId(orderId: string): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) throw new Error("Order not found");
    return OrderServiceMapper.mapToDTO(order);
  }

  async getUserOrders(phone: string): Promise<OrderResponseDTO[]> {
    const orders = await this.orderRepository.findByCustomerPhone(phone);
    return orders.map((o) => OrderServiceMapper.mapToDTO(o));
  }

  async getAllOrders(): Promise<OrderResponseDTO[]> {
    const orders = await this.orderRepository.findAll();
    return orders.map((o) => OrderServiceMapper.mapToDTO(o));
  }

  async updateOrderStatus(
    orderId: string,
    status: string,
    notes?: string,
    estimatedTime?: number
  ): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) throw new Error("Order not found");

    order.updateStatus(status as OrderStatus, notes);
    if (estimatedTime) {
      order.estimatedTime = estimatedTime;
    }

    const updated = await this.orderRepository.update(order.id, order);
    if (!updated) throw new Error("Failed to update order");

    const dto = OrderServiceMapper.mapToDTO(updated);

    // Emit socket events
    const socketManager = SocketManager.getInstance();
    socketManager.emitToAdmins("order:updated", dto);
    socketManager.emitOrderUpdate(orderId, "order:status", {
      status,
      estimatedTime,
      notes,
      timestamp: new Date(),
    });
    socketManager.broadcast("order:tracking", { orderId, status });

    return dto;
  }

  async updatePaymentStatus(
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) throw new Error("Order not found");

    order.updatePaymentStatus(
      PaymentStatus.SUCCESS,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    const updated = await this.orderRepository.update(order.id, order);
    if (!updated) throw new Error("Failed to update payment status");

    // Increment coupon usage
    if (order.couponCode) {
      const coupon = await this.couponRepository.findByCode(order.couponCode);
      if (coupon) {
        await this.couponRepository.incerementUsage(coupon.id);
      }
    }

    const dto = OrderServiceMapper.mapToDTO(updated);

    // Emit socket events
    const socketManager = SocketManager.getInstance();
    socketManager.emitToAdmins("order:payment_success", dto);
    socketManager.emitOrderUpdate(orderId, "payment:success", { orderId });

    return dto;
  }

  async cancelOrder(
    orderId: string,
    reason: string
  ): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) throw new Error("Order not found");

    order.cancel(reason);
    const updated = await this.orderRepository.update(order.id, order);
    if (!updated) throw new Error("Failed to cancel order");

    const dto = OrderServiceMapper.mapToDTO(updated);

    // Emit socket event
    const socketManager = SocketManager.getInstance();
    socketManager.emitOrderUpdate(orderId, "order:cancelled", dto);

    return dto;
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

  async getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    todayOrders: number;
  }> {
    const [allOrders, todayOrdersList] = await Promise.all([
      this.orderRepository.findAll(),
      this.orderRepository.getTodayIOrders(),
    ]);

    const pendingOrders = allOrders.filter((o) =>
      [
        OrderStatus.PENDING,
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
      ].includes(o.status)
    ).length;

    const completedOrders = allOrders.filter(
      (o) => o.status === OrderStatus.DELIVERED
    ).length;

    const totalRevenue = allOrders
      .filter((o) => o.paymentStatus === PaymentStatus.SUCCESS)
      .reduce((sum, o) => sum + o.total, 0);

    return {
      totalOrders: allOrders.length,
      pendingOrders,
      completedOrders,
      totalRevenue,
      todayOrders: todayOrdersList.length,
    };
  }
}
