import { OrderStatus, PaymentStatus } from "@/shared/types/common.types";
import { OrderEntity, OrderItem } from "../../domain/entities/Order.entity";
import { ICouponRepository } from "@/modules/Coupon.Module/domain/interfaces/ICouponRepository";
import { IOrderRepository } from "../../domain/interfaces/IOrderRepository";
import { IProductRepository } from "@/modules/Product.Module/domain/interfaces/IProductRepository";
import { CouponService } from "@/modules/Coupon.Module/application/services/Coupon.service";
import { SMSService } from "@/modules/Notification.Module/application/services/SMS.service";

export class OrderService {
  private smsService: SMSService;
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private couponService: CouponService,
    private couponRepository: ICouponRepository
  ) {
    this.smsService = new SMSService();
  }

  async createOrder(
    userId: string,
    items: Array<{ productId: string; variantId?: string; quantity: number }>,
    deliveryAddress: string,
    phone: string,
    couponCode?: string,
    notes?: string
  ): Promise<OrderEntity> {
    // Validate and prepare order items
    const orderItems: OrderItem[] = [];
    const productIds: string[] = [];
    const categoryIds: string[] = [];

    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (!product.isAvailable)
        throw new Error(`Product ${product.name} is not available`);

      productIds.push(product.id);
      categoryIds.push(product.categoryId);

      let price = product.sellingPrice;
      let variantName: string | undefined;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) throw new Error(`Variant not found`);
        if (!variant.isAvailable)
          throw new Error(`Variant ${variant.name} is not available`);
        price = variant.sellingPrice;
        variantName = variant.name;
      }

      orderItems.push({
        productId: product.id,
        productName: product.name,
        variantId: item.variantId,
        variantName,
        quantity: item.quantity,
        price,
        totalPrice: price * item.quantity,
      });
    }

    // Calculate subtotal
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const validation = await this.couponService.validateAndApplyCoupon(
        couponCode,
        subtotal,
        productIds,
        categoryIds
      );
      if (!validation.valid) {
        throw new Error(validation.reason || "Invalid coupon");
      }
      discount = validation.discount;
    }

    // Create order
    const order = OrderEntity.create(
      userId,
      orderItems,
      deliveryAddress,
      phone,
      couponCode,
      discount,
      notes
    );
    const savedOrder = await this.orderRepository.create(order);

    // Increment coupon usage if applied
    if (couponCode) {
      const coupon = await this.couponRepository.findByCode(couponCode);
      if (coupon) {
        await this.couponRepository.incrementUsage(coupon.id);
      }
    }

    return savedOrder;
  }

  async getOrderById(id: string): Promise<OrderEntity | null> {
    return await this.orderRepository.findById(id);
  }

  async getUserOrders(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ orders: OrderEntity[]; total: number }> {
    return await this.orderRepository.findByUserId(userId, page, limit);
  }

  async getAllOrders(
    page: number,
    limit: number,
    filters?: any
  ): Promise<{ orders: OrderEntity[]; total: number }> {
    return await this.orderRepository.findAll(page, limit, filters);
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    note?: string
  ): Promise<OrderEntity | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new Error("Order not found");
    if (!order.canBeUpdated()) throw new Error("Order cannot be updated");
    const updatedOrder = await this.orderRepository.updateStatus(
      id,
      status,
      note
    );
    if (updatedOrder && status === OrderStatus.CONFIRMED) {
      await this.sendOrderConfirmationSMS(updatedOrder);
    }
    return updatedOrder;
  }

  private async sendOrderConfirmationSMS(order: OrderEntity): Promise<void> {
    try {
      if (!order.phone) {
        console.warn(`No phone number for order ${order.id}`);
        return;
      }
      // Format and validate phone number
      const formattedPhone = this.smsService.formatPhoneNumber(order.phone);

      if (!this.smsService.validatePhoneNumber(formattedPhone)) {
        console.warn(
          `Invalid phone number for order ${order.id}: ${order.phone}`
        );
        return;
      }

      // Prepare SMS data
      const customerName = "Customer"; // You can extract from user data if available

      await this.smsService.sendOrderConfirmationSMS({
        orderId: order.id,
        customerName,
        phoneNumber: formattedPhone,
        orderTotal: order.total,
        estimatedTime: 30, // You can make this dynamic based on items
      });

      console.log(`✅ Order confirmation SMS sent for order ${order.id}`);
    } catch (error) {
      console.error(`❌ Failed to send order confirmation SMS:`, error);
    }
  }

  async cancelOrder(
    id: string,
    userId: string,
    isAdmin: boolean = false
  ): Promise<OrderEntity | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new Error("Order not found");

    if (!isAdmin && order.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (!order.canBeCancelled()) {
      throw new Error("Order cannot be cancelled");
    }

    return await this.orderRepository.updateStatus(
      id,
      OrderStatus.CANCELLED,
      "Cancelled by user"
    );
  }

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    razorpayPaymentId?: string
  ): Promise<OrderEntity | null> {
    return await this.orderRepository.updatePaymentStatus(
      orderId,
      paymentStatus,
      razorpayPaymentId
    );
  }
}
