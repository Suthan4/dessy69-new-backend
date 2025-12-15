import Razorpay from "razorpay";
import crypto from "crypto";

export class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_RgHzFPBMSwnKhe",
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(
    amount: number,
    orderId: string,
    customerDetails: any
  ): Promise<any> {
    try {
      const options = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: "INR",
        receipt: orderId,
        notes: {
          orderId: orderId,
          customerName: customerDetails.name,
          customerPhone: customerDetails.phone,
        },
      };

      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error: any) {
      throw new Error(`Razorpay order creation failed: ${error.message}`);
    }
  }

  verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    const body = `${orderId}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === signature;
  }

  async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      return await this.razorpay.payments.fetch(paymentId);
    } catch (error: any) {
      throw new Error(`Failed to fetch payment details: ${error.message}`);
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
