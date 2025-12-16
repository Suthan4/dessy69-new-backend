import { OrderStatus } from "@/shared/types/common.types";
import { SocketManager } from "../../infrastructure/SocketManager";
import { OrderEntity } from "@/modules/Order.Module/domain/entities/Order.entity";

export class NotificationService {
  private socketManager: SocketManager;

  constructor() {
    this.socketManager = SocketManager.getInstance();
  }

  notifyProductAvailability(
    productId: string,
    isAvailable: boolean,
    variantId?: string
  ): void {
    this.socketManager.emitProductAvailability(
      productId,
      isAvailable,
      variantId
    );
  }

  notifyOrderStatusUpdate(
    userId: string,
    orderId: string,
    status: OrderStatus,
    message?: string
  ): void {
    this.socketManager.emitOrderStatusUpdate(userId, orderId, status, message);
  }

  notifyNewOrder(order: OrderEntity): void {
    this.socketManager.emitNewOrderToAdmin(order);
  }
}
