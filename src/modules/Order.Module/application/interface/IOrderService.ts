import { CreateOrderDTO, OrderResponseDTO, OrderStatisticsDTO } from "../DTOs/OrderDTO";


export interface IOrderService {
  createOrder(orderData: CreateOrderDTO): Promise<OrderResponseDTO>;
  getOrderById(id: string): Promise<OrderResponseDTO>;
  getOrderByOrderId(orderId: string): Promise<OrderResponseDTO>;
  getUserOrders(phone: string): Promise<OrderResponseDTO[]>;
  getAllOrders(): Promise<OrderResponseDTO[]>;
  updateOrderStatus(
    orderId: string,
    status: string,
    notes?: string,
    estimatedTime?: number
  ): Promise<OrderResponseDTO>;
  updatePaymentStatus(
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<OrderResponseDTO>;
  cancelOrder(orderId: string, reason: string): Promise<OrderResponseDTO>;
  getTodayOrders(): Promise<OrderResponseDTO[]>;
  getOrderStatistics(
    startDate: Date,
    endDate: Date
  ): Promise<OrderStatisticsDTO[]>;
  getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    todayOrders: number;
  }>;
}
