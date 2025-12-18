import { registerAuthModule } from "@/modules/Auth.Module/container/auth.container";
import { Container } from "./container";
import { registerCategoryModule } from "@/modules/Category.Module/container/category.container";
import { registerProductModule } from "@/modules/Product.Module/container/product.container";
import { registerCouponModule } from "@/modules/Coupon.Module/container/coupon.container";
import { registerOrderModule } from "@/modules/Order.Module/container/order.container";
import { registerPaymentModule } from "@/modules/Payment.Module/container/payment.container";

export function initializeContainer(): Container {
  const container = Container.getInstance();

  console.log("🚀 Initializing Dependency Injection Container...\n");
  
  // IMPORTANT: Register modules in order of dependencies
  // Modules with no dependencies first, then modules that depend on them

  // Step 1: Register modules with no dependencies
  registerAuthModule(container);
  registerCategoryModule(container);

  // Step 2: Register modules that depend on Step 1
  registerProductModule(container); // Depends on Category
  registerCouponModule(container);

  // Step 3: Register modules that depend on Step 1 & 2
  registerOrderModule(container); // Depends on Product, Coupon

  // Step 4: Register modules that depend on previous steps
  registerPaymentModule(container); // Depends on Order

  console.log("\n✅ DI Container initialized successfully\n");

  return container;
}
