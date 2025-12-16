import { Router } from "express";
import {
  CreateProductSchema,
  UpdateProductSchema,
  UpdateAvailabilitySchema,
  ProductQuerySchema,
  SearchQuerySchema,
  ProductIdSchema,
} from "../../application/validators/product.validators";
import { ProductController } from "../controllers/Product.controller";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";
import { UserRole } from "@/shared/types/common.types";
import { ValidationMiddleware } from "@/shared/middleware/validation.middleware";

export class ProductRoutes {
  static create(controller: ProductController): Router {
    const router = Router();
    router.post(
      "/",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateBody(CreateProductSchema),
      controller.createProduct
    );
    router.get(
      "/",
      ValidationMiddleware.validateQuery(ProductQuerySchema),
      controller.getProducts
    );
    router.get(
      "/search",
      ValidationMiddleware.validateQuery(SearchQuerySchema),
      controller.searchProducts
    );
    router.get(
      "/:id",
      ValidationMiddleware.validateParams(ProductIdSchema),
      controller.getProductById
    );
    router.put(
      "/:id",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateParams(ProductIdSchema),
      ValidationMiddleware.validateBody(UpdateProductSchema),
      controller.updateProduct
    );
    router.patch(
      "/:id/availability",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateParams(ProductIdSchema),
      ValidationMiddleware.validateBody(UpdateAvailabilitySchema),
      controller.updateAvailability
    );
    router.delete(
      "/:id",
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN),
      ValidationMiddleware.validateParams(ProductIdSchema),
      controller.deleteProduct
    );
    return router;
  }
}
