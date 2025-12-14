import { Category } from "@/domain/entities/Category.entity";
import { CategoryResponseDTO } from "../dtos/CategoryDTO";

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
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
