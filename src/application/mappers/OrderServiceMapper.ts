import { Order } from "@/domain/entities/Order.entity";
import { OrderResponseDTO } from "../dtos/OrderDTO";

export class OrderServiceMapper {
  static mapToDTO(order: Order): OrderResponseDTO {
    return {
      id: order.id,
      userId: order.userId,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      status: order.status,
      paymentId: order.paymentId,
      couponCode: order.couponCode,  
      cancelReason: order.cancelReason,  
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
