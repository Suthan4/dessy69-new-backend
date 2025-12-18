import Razorpay from "razorpay";
import crypto from "crypto";
import { OrderEntity } from "@/modules/Order.Module/domain/entities/Order.entity";
import { OrderStatus, PaymentStatus } from "@/shared/types/common.types";
import { AppConfig } from "@/config/app.config";
import { IOrderRepository } from "@/modules/Order.Module/domain/interfaces/IOrderRepository";

export class PaymentService {
  private razorpay: Razorpay;

  constructor(private orderRepository: IOrderRepository) {
    this.razorpay = new Razorpay({
      key_id: AppConfig.razorpay.keyId,
      key_secret: AppConfig.razorpay.keySecret,
    });
  }

  async createPaymentOrder(orderId: string): Promise<any> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error("Order not found");
    // if (order.userId !== userId) throw new Error("Unauthorized");
    if (order.paymentStatus === PaymentStatus.COMPLETED)
      throw new Error("Payment already completed");

    const razorpayOrder = await this.razorpay.orders.create({
      amount: Math.round(order.total * 100), // Amount in paise
      currency: "INR",
      receipt: orderId,
      notes: {
        orderId: orderId,
      },
    });

    // Update order with razorpay order ID
    await this.orderRepository.update(orderId, {
      razorpayOrderId: razorpayOrder.id,
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: AppConfig.razorpay.keyId,
    };
  }

  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<boolean> {
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", AppConfig.razorpay.keySecret)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === razorpaySignature;
  }

  async handlePaymentSuccess(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<OrderEntity | null> {
    const isValid = await this.verifyPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    if (!isValid) throw new Error("Invalid payment signature");

    // Find order by razorpayOrderId
    const orders = await this.orderRepository.findAll(1, 1, {
      razorpayOrderId,
    });
    if (orders.orders.length === 0) throw new Error("Order not found");

    const order = orders.orders[0];

    if (!order) throw new Error("Order not found");
    // Update payment status
    const updatedOrder = await this.orderRepository.updatePaymentStatus(
      order?.id,
      PaymentStatus.COMPLETED,
      razorpayPaymentId
    );

    // Update order status to confirmed
    if (updatedOrder) {
      await this.orderRepository.updateStatus(
        order.id,
        OrderStatus.CONFIRMED,
        "Payment received"
      );
    }

    return updatedOrder;
  }

  async handlePaymentFailure(orderId: string): Promise<OrderEntity | null> {
    return await this.orderRepository.updatePaymentStatus(
      orderId,
      PaymentStatus.FAILED
    );
  }
}
