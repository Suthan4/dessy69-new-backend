import { IOrderService } from "@/application/interface/IService";
import { OrderSchema } from "../validators/schema";
import { Request,Response} from "express";

export class OrderController {
  constructor(private orderService: IOrderService) {}

  createOrder = async (req: Request, res: Response) => {
    try {
      const validated = OrderSchema.parse(req.body);
      const userId = (req as any).user.userId;

      const order = await this.orderService.createOrder(userId, validated);

      // Emit socket event
      const io = (req as any).io;
      io.emit("order:created", order);

      res.status(201).json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getUserOrders = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const orders = await this.orderService.getUserOrders(userId);
      res.json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getAllOrders = async (req: Request, res: Response) => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    try {
      const order = await this.orderService.updateOrderStatus(
        req.params.id as string,
        req.body.status
      );

      // Emit socket event for real-time tracking
      const io = (req as any).io;
      io.to(`order:${order.id}`).emit("order:statusUpdate", {
        orderId: order.id,
        status: order.status,
        updatedAt: order.updatedAt,
      });

      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  cancelOrder = async (req: Request, res: Response) => {
    try {
      const order = await this.orderService.cancelOrder(
        req.params.id as string,
        req.body.reason
      );

      // Emit socket event
      const io = (req as any).io;
      io.to(`order:${order.id}`).emit("order:cancelled", order);

      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
