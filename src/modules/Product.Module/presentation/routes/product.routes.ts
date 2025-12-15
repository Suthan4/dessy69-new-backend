
import { Router } from "express";
import { ProductController } from "../controllers/Product.controller";
import { ProductSchema } from "../validators/schema";
import { ProductRepository } from "@/modules/Product.Module/infrastructure/repositories/ProductRepository";
import { CategoryRepository } from "@/modules/Category.Module/infrastructure/repositories/CategoryReoisitory";
import { ProductService } from "@/modules/Product.Module/application/services/Product.service";
import { authenticate, authorizeAdmin } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validation.middleware";

export class ProductRoutes {
  public router: Router;
  private controller: ProductController;

  constructor() {
    this.router = Router();
    const productRepository = new ProductRepository();
    const categoryRepository = new CategoryRepository();
    const service = new ProductService(productRepository, categoryRepository);
    this.controller = new ProductController(service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Public routes
    this.router.get("/", this.controller.getAllProducts);
    this.router.get("/popular", this.controller.getPopularProducts);
    this.router.get("/search", this.controller.searchProducts);
    this.router.get("/:id", this.controller.getProductById);

    // Admin routes
    this.router.post(
      "/",
      authenticate,
      authorizeAdmin,
      validate(ProductSchema),
      this.controller.createProduct
    );

    this.router.put(
      "/:id",
      authenticate,
      authorizeAdmin,
      this.controller.updateProduct
    );
    this.router.delete(
      "/:id",
      authenticate,
      authorizeAdmin,
      this.controller.deleteProduct
    );
    this.router.patch(
      "/:id/availability",
      authenticate,
      authorizeAdmin,
      this.controller.updateAvailability
    );
  }
}
