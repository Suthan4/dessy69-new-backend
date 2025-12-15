import { OrderRepository } from "@/modules/Order.Module/infrastructure/repositories/OrderRepository";
import { RazorpayService } from "@/modules/Payment.Module/application/Payment.services";
import { authenticate } from "@/shared/middleware/auth.middleware";
import { Router, Request, Response } from "express";

export class PaymentRoutes {
  public router: Router;
  private razorpayService: RazorpayService;
  private orderRepository: OrderRepository;

  constructor() {
    this.router = Router();
    this.razorpayService = new RazorpayService();
    this.orderRepository = new OrderRepository();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post("/create-order", async (req: Request, res: Response) => {
      try {
        const { orderId } = req.body;

        // Get order details
        const order = await this.orderRepository.findByOrderId(orderId);
        if (!order) {
          return res
            .status(404)
            .json({ success: false, message: "Order not found" });
        }

        const razorpayOrder = await this.razorpayService.createOrder(
          order.total,
          order.orderId,
          order.customerDetails
        );

        res.json({
          success: true,
          data: {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID || "rzp_test_RgHzFPBMSwnKhe",
          },
        });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    this.router.post("/verify", async (req: Request, res: Response) => {
      try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
          req.body;

        const isValid = this.razorpayService.verifyPayment(
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature
        );

        if (isValid) {
          res.json({ success: true, message: "Payment verified successfully" });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Invalid signature" });
        }
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    this.router.get(
      "/:paymentId",
      authenticate,
      async (req: Request, res: Response) => {
        try {
          const payment = await this.razorpayService.getPaymentDetails(
            req.params.paymentId as string
          );
          res.json({ success: true, data: payment });
        } catch (error: any) {
          res.status(500).json({ success: false, message: error.message });
        }
      }
    );
  }
}
