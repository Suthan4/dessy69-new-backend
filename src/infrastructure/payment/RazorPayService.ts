import Razorpay from "razorpay";
import crypto from "crypto";

export class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(amount: number, currency: string = "INR"): Promise<any> {
    try {
      const options = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      };

      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      throw new Error("Failed to create Razorpay order");
    }
  }

  verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    const body = orderId + "|" + paymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === signature;
  }

  async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      return await this.razorpay.payments.fetch(paymentId);
    } catch (error) {
      throw new Error("Failed to fetch payment details");
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<any> {
    try {
      const refundData: any = { payment_id: paymentId };
      if (amount) {
        refundData.amount = amount * 100;
      }

      return await this.razorpay.payments.refund(paymentId, refundData);
    } catch (error) {
      throw new Error("Failed to process refund");
    }
  }
}
