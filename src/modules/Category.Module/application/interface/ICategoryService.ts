import { CategoryBreadcrumbDTO, CategoryResponseDTO, CreateCategoryDTO, UpdateCategoryDTO } from "../DTOs/CategoryDTO";

export interface ICategoryService {
  createCategory(data: CreateCategoryDTO): Promise<CategoryResponseDTO>;
  getAllCategories(includeInactive?: boolean): Promise<CategoryResponseDTO[]>;
  getCategoryById(id: string): Promise<CategoryResponseDTO>;
  updateCategory(
    id: string,
    data: UpdateCategoryDTO
  ): Promise<CategoryResponseDTO>;
  getCategoryBreadcrumb(categoryId: string): Promise<CategoryBreadcrumbDTO[]>;
  deleteCategory(id: string): Promise<boolean>;
  getRootCategories(): Promise<CategoryResponseDTO[]>;
  getChildCategories(parentId: string): Promise<CategoryResponseDTO[]>;
  getCategoryHierarchy(): Promise<any>;
}
