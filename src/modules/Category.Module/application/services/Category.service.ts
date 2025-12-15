
import { CategoryServiceMapper } from "../mappers/CategoryServiceMapper";
import { ICategoryService } from "../interface/ICategoryService";
import { ICategoryRepository } from "@/modules/Category.Module/domain/interfaces/ICategoryRepository";
import { CategoryBreadcrumbDTO, CategoryResponseDTO, CreateCategoryDTO, UpdateCategoryDTO } from "../DTOs/CategoryDTO";
import { Category } from "@/modules/Category.Module/domain/entities/Category.entity";
import { SocketManager } from "@/shared/infrastructure/SocketManager";

export class CategoryService implements ICategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async createCategory(data: CreateCategoryDTO): Promise<CategoryResponseDTO> {
    // Calculate level and path based on parent
    let level = 0;
    let parentPath: string | null = null;
    let parentId: string | null = null;

    if (data.parentId) {
      const parent = await this.categoryRepository.findById(data.parentId);
      if (!parent) throw new Error("Parent category not found");

      level = parent.level + 1;
      parentPath = parent.path;
      parentId = parent.id;
    }

    // Create category with temporary path
    const category = new Category(
      "",
      data.name,
      data.description,
      data.image,
      data.isActive ?? true,
      parentId,
      level,
      "temp", // Will be updated after creation
      new Date(),
      new Date()
    );

    const created = await this.categoryRepository.create(category);

    // Update path with actual ID
    const path = parentPath ? `${parentPath}/${created.id}` : created.id;
    const updated = await this.categoryRepository.update(created.id, {
      path,
    } as any);

    if (!updated) throw new Error("Failed to update category path");

    const dto = CategoryServiceMapper.mapToDTO(updated);

    const socketManager = SocketManager.getInstance();
    socketManager.broadcast("category:created", dto);

    return dto;
  }

  async getAllCategories(
    includeInactive = false
  ): Promise<CategoryResponseDTO[]> {
    const categories = includeInactive
      ? await this.categoryRepository.findAll()
      : await this.categoryRepository.findActive();
    return categories.map((c) => CategoryServiceMapper.mapToDTO(c));
  }

  async getRootCategories(): Promise<CategoryResponseDTO[]> {
    const categories = await this.categoryRepository.findRootCategories();
    return categories.map((c) => CategoryServiceMapper.mapToDTO(c));
  }

  async getChildCategories(parentId: string): Promise<CategoryResponseDTO[]> {
    const categories = await this.categoryRepository.findChildCategories(
      parentId
    );
    return categories.map((c) => CategoryServiceMapper.mapToDTO(c));
  }

  async getCategoryHierarchy(): Promise<any> {
    const allCategories = await this.categoryRepository.findActive();

    // Build hierarchy
    const buildTree = (parentId: string | null): any[] => {
      return allCategories
        .filter((cat) => cat.parentId === parentId)
        .map((cat) => ({
          ...CategoryServiceMapper.mapToDTO(cat),
          children: buildTree(cat.id),
        }));
    };

    return buildTree(null);
  }

  async getCategoryById(id: string): Promise<CategoryResponseDTO> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new Error("Category not found");
    return CategoryServiceMapper.mapToDTO(category);
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryDTO
  ): Promise<CategoryResponseDTO> {
    const updated = await this.categoryRepository.update(id, data as any);
    if (!updated) throw new Error("Category not found");

    const dto = CategoryServiceMapper.mapToDTO(updated);
    const socketManager = SocketManager.getInstance();
    socketManager.broadcast("category:updated", dto);

    return dto;
  }

  async deleteCategory(id: string): Promise<boolean> {
    // Check if category has children
    const children = await this.categoryRepository.findChildCategories(id);
    if (children.length > 0) {
      throw new Error("Cannot delete category with children");
    }

    const result = await this.categoryRepository.delete(id);

    if (result) {
      const socketManager = SocketManager.getInstance();
      socketManager.broadcast("category:deleted", { id });
    }

    return result;
  }

  // Helper method to get breadcrumb trail (ID path to name path)
  async getCategoryBreadcrumb(
    categoryId: string
  ): Promise<CategoryBreadcrumbDTO[]> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new Error("Category not found");

    const breadcrumb: CategoryBreadcrumbDTO[] = [];
    const pathIds = category.path.split("/");

    for (const id of pathIds) {
      const cat = await this.categoryRepository.findById(id);
      if (cat) {
        breadcrumb.push({
          id: cat.id,
          name: cat.name,
          level: Number(cat.level), 
        });
      }
    }

    return breadcrumb;
  }
}
