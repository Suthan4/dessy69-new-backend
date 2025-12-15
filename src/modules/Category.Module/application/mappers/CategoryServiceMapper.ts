import { Category } from "@/modules/Category.Module/domain/entities/Category.entity";
import { CategoryResponseDTO } from "../DTOs/CategoryDTO";


export class CategoryServiceMapper {
  static mapToDTO(category: Category): CategoryResponseDTO {
    return {
      id: category.id,
      name: category.name,
      ...(category.description !== undefined && {
        description: category.description,
      }),
      ...(category.image !== undefined && {
        image: category.image,
      }),
      isActive: category.isActive,
      parentId: category.parentId,
      level: category.level,
      path: category.path,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}