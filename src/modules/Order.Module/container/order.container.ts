import { TYPES } from "@/shared/container/types";
import { OrderRepository } from "../infrastructure/repositories/OrderRepository";
import { OrderService } from "../application/services/Order.service";
import { OrderController } from "../presentation/controllers/Order.controller";
import { Container } from "@/shared/container/container";

export function registerOrderModule(container: Container): void {
  console.log("📦 Registering Order Module...");

  // 1. Register Repository
  const orderRepository = new OrderRepository();
  container.register(TYPES.OrderRepository, orderRepository);

  // 2. Register Service (complex dependencies)
  const orderService = new OrderService(
    container.resolve(TYPES.OrderRepository),
    container.resolve(TYPES.ProductRepository), // Cross-module
    container.resolve(TYPES.CouponService), // Cross-module
    container.resolve(TYPES.CouponRepository) // Cross-module
  );
  container.register(TYPES.OrderService, orderService);

  // 3. Register Controller
  const orderController = new OrderController(
    container.resolve(TYPES.OrderService)
  );
  container.register(TYPES.OrderController, orderController);

  console.log("✅ Order Module registered");
}
