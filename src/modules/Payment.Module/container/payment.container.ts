import { Container } from "@/shared/container/container";
import { PaymentService } from "../application/Payment.services";
import { TYPES } from "@/shared/container/types";
import { PaymentController } from "../presentation/controllers/Payment.controller";

export function registerPaymentModule(container: Container): void {
  console.log("📦 Registering Payment Module...");

  // 1. Register Service (no repository, uses external API)
  const paymentService = new PaymentService(
    container.resolve(TYPES.OrderRepository) // Cross-module
  );
  container.register(TYPES.PaymentService, paymentService);

  // 2. Register Controller
  const paymentController = new PaymentController(
    container.resolve(TYPES.PaymentService)
  );
  container.register(TYPES.PaymentController, paymentController);

  console.log("✅ Payment Module registered");
}
