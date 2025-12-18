import { Container } from "@/shared/container/container";
import { CategoryRepository } from "../infrastructure/repositories/CategoryRepoisitory";
import { TYPES } from "@/shared/container/types";
import { CategoryService } from "../application/services/Category.service";
import { CategoryController } from "../presentation/controllers/Category.controller";

export function registerCategoryModule(container: Container): void {
  console.log("📦 Registering Category Module...");
  // 1. Register Repository
  const categoryRegository = new CategoryRepository();
  container.register(TYPES.CategoryRepository, categoryRegository);
  // 2. Register Service (depends on repository)
  const categoryService = new CategoryService(
    container.resolve(TYPES.CategoryRepository)
  );
  container.register(TYPES.CategoryService, categoryService);
  // 3. Register Controller (depends on service)
  const categoryController = new CategoryController(
    container.resolve(TYPES.CategoryService)
  );
  container.register(TYPES.CategoryController, categoryController);

  console.log("✅ Category Module registered");
}
