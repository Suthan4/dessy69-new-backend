import { Router } from "express";
import { CategoryController } from "../controllers/Category.controller";
import { CategorySchema } from "../validators/schema";
import { CategoryService } from "@/modules/Category.Module/application/services/Category.service";
import { CategoryRepository } from "@/modules/Category.Module/infrastructure/repositories/CategoryReoisitory";
import { authenticate, authorizeAdmin } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validation.middleware";

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
    this.router.get("/roots", this.controller.getRootCategories);
    this.router.get("/hierarchy", this.controller.getCategoryHierarchy);
    this.router.get("/:id", this.controller.getCategoryById);
    this.router.get("/:id/children", this.controller.getChildCategories);
    this.router.get("/:id/breadcrumb", this.controller.getCategoryBreadcrumb);

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