import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { RazorpayService } from "@/infrastructure/payment/RazorPayService";

export class PaymentRoutes {
  public router: Router;
  private razorpayService: RazorpayService;

  constructor() {
    this.router = Router();
    this.razorpayService = new RazorpayService();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      "/create-order",
      authenticate,
      async (req: Request, res: Response) => {
        try {
          const { amount } = req.body;
          const order = await this.razorpayService.createOrder(amount);

          res.json({
            success: true,
            data: {
              orderId: order.id,
              amount: order.amount,
              currency: order.currency,
              key: process.env.RAZORPAY_KEY_ID,
            },
          });
        } catch (error: any) {
          res.status(500).json({ success: false, message: error.message });
        }
      }
    );

    this.router.post(
      "/verify",
      authenticate,
      async (req: Request, res: Response) => {
        try {
          const { orderId, paymentId, signature } = req.body;

          const isValid = this.razorpayService.verifyPayment(
            orderId,
            paymentId,
            signature
          );

          if (isValid) {
            res.json({ success: true, message: "Payment verified" });
          } else {
            res
              .status(400)
              .json({ success: false, message: "Invalid signature" });
          }
        } catch (error: any) {
          res.status(500).json({ success: false, message: error.message });
        }
      }
    );
  }
}
