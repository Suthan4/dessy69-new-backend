import { Order } from "@/modules/Order.Module/domain/entities/Order.entity";
import { OrderResponseDTO } from "../DTOs/OrderDTO";


export class OrderServiceMapper {
  static mapToDTO(order: Order): OrderResponseDTO {
    return {
      id: order.id,
      orderId: order.orderId,
      customerDetails: order.customerDetails,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,

      ...(order.paymentId !== undefined && {
        paymentId: order.paymentId,
      }),
      ...(order.razorpayOrderId !== undefined && {
        razorpayOrderId: order.razorpayOrderId,
      }),
      ...(order.razorpayPaymentId !== undefined && {
        razorpayPaymentId: order.razorpayPaymentId,
      }),
      ...(order.razorpaySignature !== undefined && {
        razorpaySignature: order.razorpaySignature,
      }),
      ...(order.couponCode !== undefined && {
        couponCode: order.couponCode,
      }),
      ...(order.notes !== undefined && {
        notes: order.notes,
      }),
      ...(order.estimatedTime !== undefined && {
        estimatedTime: order.estimatedTime,
      }),
      trackingHistory: order.trackingHistory ?? undefined,

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
