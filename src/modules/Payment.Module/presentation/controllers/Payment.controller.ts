import { Request, Response } from "express";
import { AuthRequest } from "@/shared/middleware/auth.middleware";
import { PaymentService } from "../../application/Payment.services";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  createPaymentOrder = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { orderId } = req.body;
      const paymentOrder = await this.paymentService.createPaymentOrder( orderId);
      res.json({ success: true, data: paymentOrder });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        req.body;
      const order = await this.paymentService.handlePaymentSuccess(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );
      res.json({
        success: true,
        data: order,
        message: "Payment verified successfully",
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
