import { Order, OrderItem, OrderStatus } from "@/domain/entities/Order.entity";
import { IOrderDocument } from "../models/Order.model";
import { ProductVariant } from "@/domain/entities/Product.entity";

export class OrderMapper {
  static mapToEntity(doc: IOrderDocument): Order {
    return new Order(
      doc._id.toString(),
      doc.userId,
      doc.items.map(
        (item) =>
          new OrderItem(
            item.productId,
            item.productName,
            item.quantity,
            item.basePrice,
            item.variant
              ? new ProductVariant(
                  item.variant.name ?? "",
                  item.variant.additionalPrice ?? 0,
                  item.variant.isAvailable ?? true
                )
              : null,
            item.totalPrice
          )
      ),
      doc.subtotal,
      doc.discount,
      doc.total,
      doc.status as OrderStatus,
      doc.paymentId,
      doc.couponCode ?? null,
      doc.cancelReason ?? null,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toPresistance(entity: Order) {
    return {
      userId: entity.userId,
      items: entity.items.map((item) => {
        const base: any = {
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          basePrice: item.basePrice,
          totalPrice: item.totalPrice,
        };

        if (item.variant) {
          base.variant = {
            name: item.variant.name,
            additionalPrice: item.variant.additionalPrice,
            isAvailable: item.variant.isAvailable,
          };
        }

        return base;
      }),
      subtotal: entity.subtotal,
      discount: entity.discount,
      total: entity.total,
      status: entity.status,
      paymentId: entity.paymentId,
      ...(entity.couponCode && { couponCode: entity.couponCode }),
    };
  }
}
