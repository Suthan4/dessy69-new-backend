import { ICategoryRepository } from "@/domain/interfaces/ICategoryRepository";
import { Category } from "@/domain/entities/Category.entity";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CategoryResponseDTO,
} from "../dtos/CategoryDTO";
import { CategoryServiceMapper } from "../mappers/CategoryServiceMapper";
import { SocketManager } from "@/infrastructure/socket/SocketManager";

export interface ICategoryService {
  createCategory(data: CreateCategoryDTO): Promise<CategoryResponseDTO>;
  getAllCategories(includeInactive?: boolean): Promise<CategoryResponseDTO[]>;
  getCategoryById(id: string): Promise<CategoryResponseDTO>;
  updateCategory(
    id: string,
    data: UpdateCategoryDTO
  ): Promise<CategoryResponseDTO>;
  deleteCategory(id: string): Promise<boolean>;
}

export class CategoryService implements ICategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async createCategory(data: CreateCategoryDTO): Promise<CategoryResponseDTO> {
    const category = new Category(
      "",
      data.name,
      data.description,
      data.image,
      data.isActive ?? true,
      new Date(),
      new Date()
    );

    const created = await this.categoryRepository.create(category);
    const dto = CategoryServiceMapper.mapToDTO(created);

    // Emit socket event
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

    // Emit socket event
    const socketManager = SocketManager.getInstance();
    socketManager.broadcast("category:updated", dto);

    return dto;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);

    if (result) {
      const socketManager = SocketManager.getInstance();
      socketManager.broadcast("category:deleted", { id });
    }

    return result;
  }
}
