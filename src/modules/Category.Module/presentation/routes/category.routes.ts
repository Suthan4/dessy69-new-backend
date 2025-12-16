import { Router } from "express";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  CategoryIdSchema,
} from "../../application/validators/category.validators";
import { CategoryController } from "../controllers/Category.controller";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { UserRole } from "@/shared/types/common.types";
import { ValidationMiddleware } from "@/shared/middleware/validation.middleware";

export class CategoryRoutes {
  static create(controller: CategoryController): Router {
    const router = Router();
    router.post(
      "/",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateBody(CreateCategorySchema),
      controller.createCategory
    );
    router.get("/tree", controller.getCategoryTree);
    router.get(
      "/:id",
      ValidationMiddleware.validateParams(CategoryIdSchema),
      controller.getCategoryById
    );
    router.put(
      "/:id",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateParams(CategoryIdSchema),
      ValidationMiddleware.validateBody(UpdateCategorySchema),
      controller.updateCategory
    );
    router.delete(
      "/:id",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateParams(CategoryIdSchema),
      controller.deleteCategory
    );
    return router;
  }
}
