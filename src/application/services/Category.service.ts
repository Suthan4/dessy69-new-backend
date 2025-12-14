// import { ICategoryRepository } from "@/domain/interfaces/ICategoryRepository";
// import { Category } from "@/domain/entities/Category.entity";
// import {
//   CreateCategoryDTO,
//   UpdateCategoryDTO,
//   CategoryResponseDTO,
//   CategoryTreeDTO,
//   CategoryBreadcrumbDTO,
// } from "../dtos/CategoryDTO";
// import { CategoryServiceMapper } from "../mappers/CategoryServiceMapper";
// import { SocketManager } from "@/infrastructure/socket/SocketManager";
// import { ICategoryService } from "../interface/IService";
// export class CategoryService implements ICategoryService {
//   constructor(private categoryRepository: ICategoryRepository) {}

//   async createCategory(data: CreateCategoryDTO): Promise<CategoryResponseDTO> {
//     let path: string;
//     let level: number;
//     let parentId: string | null = data.parentId || null;

//     if (parentId) {
//       const parent = await this.categoryRepository.findById(parentId);
//       if (!parent) throw new Error("Parent category not found");
//       if (!parent.isActive) throw new Error("Parent category is inactive");
//       path = "";
//       level = parent.level + 1;
//     } else {
//       path = "";
//       level = 0;
//     }

//     const category = new Category(
//       "",
//       data.name,
//       data.description,
//       data.image,
//       data.isActive ?? true,
//       path,
//       parentId,
//       level,
//       new Date(),
//       new Date()
//     );

//     const created = await this.categoryRepository.create(category);

//     const finalPath = parentId
//       ? `${(await this.categoryRepository.findById(parentId))!.path}${
//           created.id
//         }/`
//       : `/${created.id}/`;

//     created.path = finalPath;
//     const updated = await this.categoryRepository.update(created.id, {
//       path: finalPath,
//     });

//     const dto = CategoryServiceMapper.mapToDTO(updated!);

//     const socketManager = SocketManager.getInstance();
//     socketManager.broadcast("category:created", dto);

//     return dto;
//   }

//   async getAllCategories(
//     includeInactive = false
//   ): Promise<CategoryResponseDTO[]> {
//     const categories = includeInactive
//       ? await this.categoryRepository.findAll()
//       : await this.categoryRepository.findActive();
//     return categories.map((c) => CategoryServiceMapper.mapToDTO(c));
//   }

//   async getCategoryById(id: string): Promise<CategoryResponseDTO> {
//     const category = await this.categoryRepository.findById(id);
//     if (!category) throw new Error("Category not found");
//     return CategoryServiceMapper.mapToDTO(category);
//   }

//   async updateCategory(
//     id: string,
//     data: UpdateCategoryDTO
//   ): Promise<CategoryResponseDTO> {
//     const category = await this.categoryRepository.findById(id);
//     if (!category) throw new Error("Category not found");

//     if (data.parentId !== undefined && data.parentId !== category.parentId) {
//       return this.moveCategory(id, data.parentId);
//     }

//     const updated = await this.categoryRepository.update(id, data as any);
//     if (!updated) throw new Error("Category not found");

//     const dto = CategoryServiceMapper.mapToDTO(updated);

//     const socketManager = SocketManager.getInstance();
//     socketManager.broadcast("category:updated", dto);

//     return dto;
//   }

//   async deleteCategory(id: string): Promise<boolean> {
//     const hasChildren = await this.categoryRepository.hasChildren(id);
//     if (hasChildren) {
//       throw new Error(
//         "Cannot delete category with subcategories. Delete children first."
//       );
//     }

//     const result = await this.categoryRepository.delete(id);

//     if (result) {
//       const socketManager = SocketManager.getInstance();
//       socketManager.broadcast("category:deleted", { id });
//     }

//     return result;
//   }

//   async getRootCategories(): Promise<CategoryResponseDTO[]> {
//     const roots = await this.categoryRepository.findRoots();
//     return roots.map((c) => CategoryServiceMapper.mapToDTO(c));
//   }

//   async getChildCategories(parentId: string): Promise<CategoryResponseDTO[]> {
//     const children = await this.categoryRepository.findChildren(parentId);
//     return children.map((c) => CategoryServiceMapper.mapToDTO(c));
//   }

//   async getCategoryTree(): Promise<CategoryTreeDTO[]> {
//     const allCategories = await this.categoryRepository.findActive();
//     return this.buildTree(allCategories);
//   }

//   async getCategoryBreadcrumbs(
//     categoryId: string
//   ): Promise<CategoryBreadcrumbDTO[]> {
//     const category = await this.categoryRepository.findById(categoryId);
//     if (!category) throw new Error("Category not found");

//     const ancestors = await this.categoryRepository.findAncestors(
//       category.path,
//       category.id
//     );

//     const breadcrumbs: CategoryBreadcrumbDTO[] = ancestors
//       .sort((a, b) => a.level - b.level)
//       .map((cat) => ({
//         id: cat.id,
//         name: cat.name,
//         level: cat.level,
//       }));

//     breadcrumbs.push({
//       id: category.id,
//       name: category.name,
//       level: category.level,
//     });

//     return breadcrumbs;
//   }

//   async moveCategory(
//     categoryId: string,
//     newParentId: string | null
//   ): Promise<CategoryResponseDTO> {
//     const category = await this.categoryRepository.findById(categoryId);
//     if (!category) throw new Error("Category not found");

//     const oldPath = category.path;
//     let newParentPath: string;

//     if (newParentId === null) {
//       newParentPath = "";
//     } else {
//       const newParent = await this.categoryRepository.findById(newParentId);
//       if (!newParent) throw new Error("New parent category not found");
//       if (!newParent.isActive)
//         throw new Error("New parent category is inactive");

//       if (newParent.path.startsWith(category.path)) {
//         throw new Error("Cannot move category to its own descendant");
//       }

//       newParentPath = newParent.path;
//     }

//     const newPath =
//       newParentId === null
//         ? `/${category.id}/`
//         : `${newParentPath}${category.id}/`;

//     category.updateParent(newParentId, newParentPath);

//     await this.categoryRepository.updateDescendantPaths(oldPath, newPath);

//     const updated = await this.categoryRepository.update(categoryId, {
//       parentId: category.parentId,
//       path: category.path,
//       level: category.level,
//     });

//     if (!updated) throw new Error("Failed to move category");

//     const dto = CategoryServiceMapper.mapToDTO(updated);

//     const socketManager = SocketManager.getInstance();
//     socketManager.broadcast("category:moved", dto);

//     return dto;
//   }

//   private buildTree(categories: Category[]): CategoryTreeDTO[] {
//     const categoryMap = new Map<string, CategoryTreeDTO>();
//     const roots: CategoryTreeDTO[] = [];

//     categories.forEach((cat) => {
//       categoryMap.set(cat.id, {
//         ...CategoryServiceMapper.mapToDTO(cat),
//         children: [],
//       });
//     });

//     categories.forEach((cat) => {
//       const node = categoryMap.get(cat.id)!;

//       if (cat.parentId === null) {
//         roots.push(node);
//       } else {
//         const parent = categoryMap.get(cat.parentId);
//         if (parent) {
//           parent.children.push(node);
//         }
//       }
//     });

//     return roots;
//   }
// }
import { ICategoryRepository } from "@/domain/interfaces/ICategoryRepository";
import { Category } from "@/domain/entities/Category.entity";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CategoryResponseDTO,
  CategoryBreadcrumbDTO,
} from "../dtos/CategoryDTO";
import { CategoryServiceMapper } from "../mappers/CategoryServiceMapper";
import { SocketManager } from "@/infrastructure/socket/SocketManager";
import { ICategoryService } from "../interface/IService";

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
