import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from "@/domain/entities/Order.entity";
import { IOrderDocument } from "../models/Order.model";

export class OrderMapper {
  static mapToEntity(doc: IOrderDocument): Order {
    return new Order(
      doc._id.toString(),
      doc.orderId,
      doc.customerDetails,
      doc.items.map(
        (item) =>
          new OrderItem(
            item.menuItemId,
            item.name,
            item.variantName,
            item.price,
            item.quantity,
            item.totalPrice
          )
      ),
      doc.subtotal,
      doc.discount,
      doc.total,
      doc.status as OrderStatus,
      doc.paymentStatus as PaymentStatus,
      doc.paymentId,
      doc.razorpayOrderId,
      doc.razorpayPaymentId,
      doc.razorpaySignature,
      doc.couponCode ?? null,
      doc.notes,
      doc.estimatedTime,
      doc.trackingHistory.map((h) => ({
        status: h.status as OrderStatus,
        timestamp: h.timestamp,
        ...(h.notes !== undefined && { notes: h.notes }),
      })),
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toPersistence(entity: Order) {
    const data: any = {
      orderId: entity.orderId,
      customerDetails: entity.customerDetails,
      items: entity.items.map((item) => ({
        menuItemId: item.menuItemId,
        name: item.name,
        variantName: item.variantName,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
      subtotal: entity.subtotal,
      discount: entity.discount,
      total: entity.total,
      status: entity.status,
      paymentStatus: entity.paymentStatus,
      trackingHistory: entity.trackingHistory,
    };

    if (entity.paymentId) data.paymentId = entity.paymentId;
    if (entity.razorpayOrderId) data.razorpayOrderId = entity.razorpayOrderId;
    if (entity.razorpayPaymentId)
      data.razorpayPaymentId = entity.razorpayPaymentId;
    if (entity.razorpaySignature)
      data.razorpaySignature = entity.razorpaySignature;
    if (entity.couponCode) data.couponCode = entity.couponCode;
    if (entity.notes) data.notes = entity.notes;
    if (entity.estimatedTime) data.estimatedTime = entity.estimatedTime;

    return data;
  }
}
