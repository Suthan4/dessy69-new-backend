import { Router } from "express";
import { CategoryController } from "../controllers/Category.controller";
import { CategoryService } from "@/application/services/Category.service";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { CategorySchema } from "../validators/schema";
import { CategoryRepository } from "@/infrastructure/database/repositories/CategoryReoisitory";

export class CategoryRoutes {
  public router: Router;
  private controller: CategoryController;

  constructor() {
    this.router = Router();
    const repository = new CategoryRepository();
    const service = new CategoryService(repository);
    this.controller = new CategoryController(service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Public routes
    this.router.get("/", this.controller.getAllCategories);
    this.router.get("/:id", this.controller.getCategoryById);

    // Admin routes
    this.router.post(
      "/",
      authenticate,
      authorizeAdmin,
      validate(CategorySchema),
      this.controller.createCategory
    );
    this.router.put(
      "/:id",
      authenticate,
      authorizeAdmin,
      this.controller.updateCategory
    );
    this.router.delete(
      "/:id",
      authenticate,
      authorizeAdmin,
      this.controller.deleteCategory
    );
  }
}
