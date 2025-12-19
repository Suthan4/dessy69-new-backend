import { AppConfig } from "@/config/app.config";
import axios from "axios";

export interface SMSPayload {
  phoneNumber: string;
  message: string;
}

export interface OrderSMSData {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  orderTotal: number;
  estimatedTime?: number;
}

export class SMSService {
  private apiKey: string;
  private senderId: string;
  private baseUrl: string = "https://www.fast2sms.com/dev/bulkV2";

  constructor() {
    this.apiKey = AppConfig.fast2sms.apiKey;
    this.senderId = AppConfig.fast2sms.senderId;

    if (!this.apiKey) {
      console.warn("⚠️ Fast2SMS API Key not configured");
    }
  }

  /**
   * Send a generic SMS
   */
  async sendSMS(payload: SMSPayload): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.error("Fast2SMS API Key not configured");
        return false;
      }

      const response = await axios.post(
        this.baseUrl,
        {
          route: "q",
          message: payload.message,
          language: "english",
          flash: 0,
          numbers: payload.phoneNumber,
        },
        {
          headers: {
            authorization: this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.return) {
        console.log(`✅ SMS sent successfully to ${payload.phoneNumber}`);
        return true;
      } else {
        console.error("❌ Failed to send SMS:", response.data.message);
        return false;
      }
    } catch (error: any) {
      console.error("❌ SMS Service Error:", error.message);
      return false;
    }
  }

  /**
   * Send order confirmation SMS
   */
  async sendOrderConfirmationSMS(data: OrderSMSData): Promise<boolean> {
    const message = this.buildOrderConfirmationMessage(data);
    return await this.sendSMS({
      phoneNumber: data.phoneNumber,
      message,
    });
  }

  /**
   * Send order status update SMS
   */
  async sendOrderStatusUpdateSMS(
    phoneNumber: string,
    orderId: string,
    status: string
  ): Promise<boolean> {
    const statusMessages: Record<string, string> = {
      confirmed: "Your order has been confirmed and is being prepared!",
      preparing: "Your order is being prepared by our team.",
      ready: "Your order is ready for pickup/delivery!",
      out_for_delivery: "Your order is out for delivery!",
      delivered: "Your order has been delivered. Enjoy your treats!",
      cancelled: "Your order has been cancelled.",
    };

    const message = `Dessy69 Update: ${
      statusMessages[status] || "Order status updated"
    } Order ID: ${orderId}`;

    return await this.sendSMS({ phoneNumber, message });
  }

  /**
   * Send OTP SMS
   */
  async sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.error("Fast2SMS API Key not configured");
        return false;
      }

      const response = await axios.post(
        this.baseUrl,
        {
          route: "otp",
          variables_values: otp,
          flash: 0,
          numbers: phoneNumber,
        },
        {
          headers: {
            authorization: this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.return) {
        console.log(`✅ OTP sent successfully to ${phoneNumber}`);
        return true;
      } else {
        console.error("❌ Failed to send OTP:", response.data.message);
        return false;
      }
    } catch (error: any) {
      console.error("❌ OTP Service Error:", error.message);
      return false;
    }
  }

  /**
   * Build order confirmation message
   */
  private buildOrderConfirmationMessage(data: OrderSMSData): string {
    const estimatedTimeText = data.estimatedTime
      ? ` ETA: ${data.estimatedTime} mins.`
      : "";

    return `Hi ${data.customerName}! 🍔
Your Dessy69 order #${data.orderId} (Rs.${data.orderTotal}) is confirmed.${estimatedTimeText}
Track your order: https://localhost3000/orders/${data.orderId}
Thank you for choosing us!`;
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phone: string): boolean {
    // Indian phone number validation (10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Format phone number (remove +91, spaces, hyphens)
   */
  formatPhoneNumber(phone: string): string {
    return phone.replace(/[\s\-+]/g, "").replace(/^91/, "");
  }
}
