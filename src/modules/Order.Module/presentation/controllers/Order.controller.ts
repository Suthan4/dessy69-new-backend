import { Request, Response } from "express";
import { AuthRequest } from "@/shared/middleware/auth.middleware";
import { OrderService } from "../../application/services/Order.service";
import { OrderStatus, PaymentStatus, UserRole } from "@/shared/types/common.types";

export class OrderController {
  constructor(private orderService: OrderService) {}

  createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { items, deliveryAddress, phone, couponCode, notes } = req.body;
      const order = await this.orderService.createOrder(
        req.userId!,
        items,
        deliveryAddress,
        phone,
        couponCode,
        notes
      );
      res.status(201).json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.orderService.getUserOrders(
        req.userId!,
        page,
        limit
      );
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        status: req.query.status as OrderStatus,
        paymentStatus: req.query.paymentStatus as PaymentStatus,
      };
      const result = await this.orderService.getAllOrders(page, limit, filters);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await this.orderService.getOrderById(req.params.id as string);
      if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, note } = req.body;
      const order = await this.orderService.updateOrderStatus(
        req.params.id as string,
        status,
        note
      );
      if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const isAdmin = req.userRole === UserRole.ADMIN;
      const order = await this.orderService.cancelOrder(
        req.params.id as string,
        req.userId!,
        isAdmin
      );
      if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
