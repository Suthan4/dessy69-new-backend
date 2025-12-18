import { Container } from "@/shared/container/container";
import { ProductRepository } from "../infrastructure/repositories/ProductRepository";
import { TYPES } from "@/shared/container/types";
import { ProductService } from "../application/services/Product.service";
import { ProductController } from "../presentation/controllers/Product.controller";

export function registerProductModule(container: Container): void {
  console.log("📦 Registering Product Module...");

  // 1. Register Repository
  const productRepository = new ProductRepository();
  container.register(TYPES.ProductRepository, productRepository);

  // 2. Register Service (depends on Repository)
  const productService = new ProductService(
    container.resolve(TYPES.ProductRepository),
    container.resolve(TYPES.CategoryRepository)
  );
  container.register(TYPES.ProductService, productService);

  // 3. Register Controller (depends on Controller)
  const productController = new ProductController(
    container.resolve(TYPES.ProductService)
  );
  container.register(TYPES.ProductController, productController);
  
  console.log("✅ Product Module registered");
}
