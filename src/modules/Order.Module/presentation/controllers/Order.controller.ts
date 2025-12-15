import { IOrderService } from "@/modules/Order.Module/application/interface/IOrderService";
import { Request, Response } from "express";

export class OrderController {
  constructor(private orderService: IOrderService) {}

  createOrder = async (req: Request, res: Response) => {
    try {
      const order = await this.orderService.createOrder(req.body);
      res.status(201).json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getOrderByOrderId = async (req: Request, res: Response) => {
    try {
      const order = await this.orderService.getOrderByOrderId(
        req.params.orderId as string
      );
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  getUserOrders = async (req: Request, res: Response) => {
    try {
      const { phone } = req.query;
      if (!phone) {
        return res
          .status(400)
          .json({ success: false, message: "Phone number required" });
      }
      const orders = await this.orderService.getUserOrders(phone as string);
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
      const { status, notes, estimatedTime } = req.body;
      const order = await this.orderService.updateOrderStatus(
        req.params.orderId as string,
        status,
        notes,
        estimatedTime
      );
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  verifyPayment = async (req: Request, res: Response) => {
    try {
      const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        req.body;
      const order = await this.orderService.updatePaymentStatus(
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );
      res.json({
        success: true,
        message: "Payment verified successfully",
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  cancelOrder = async (req: Request, res: Response) => {
    try {
      const { reason } = req.body;
      const order = await this.orderService.cancelOrder(
        req.params.orderId as string,
        reason
      );
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getOrderStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.orderService.getOrderStats();
      res.json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
