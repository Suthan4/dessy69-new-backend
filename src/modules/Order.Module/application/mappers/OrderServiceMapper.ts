import { OrderEntity } from "../../domain/entities/Order.entity";

export class OrderServiceMapper {
  static fromPersistence(doc: any): OrderEntity {
    if (!doc) {
      throw new Error("Order document is undefined");
    }

    return new OrderEntity(
      doc._id.toString(), // ✅ now id exists
      doc.items,
      doc.subtotal,
      doc.discount,
      doc.deliveryCharge,
      doc.total,
      doc.status,
      doc.paymentStatus,
      doc.phone,
      doc.couponCode,
      doc.deliveryAddress,
      doc.userId?.toString(),
      doc.notes,
      doc.razorpayOrderId,
      doc.razorpayPaymentId,
      doc.statusHistory,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
