import { CategoryEntity } from "../../domain/entities/Category.entity";
import { ICategoryRepository } from "../../domain/interfaces/ICategoryRepository";

export class CategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async createCategory(
    name: string,
    slug: string,
    parentId?: string
  ): Promise<CategoryEntity> {
    const existingSlug = await this.categoryRepository.findBySlug(slug);
    if (existingSlug) {
      throw new Error("Slug already exists");
    }

    let parentPath = "";
    if (parentId) {
      const parent = await this.categoryRepository.findById(parentId);
      if (!parent) throw new Error("Parent category not found");
      parentPath = parent.path;
    }

    const category = CategoryEntity.create(name, slug, parentPath, parentId);
    return await this.categoryRepository.create(category);
  }

  async getCategoryTree(): Promise<any[]> {
    const categories = await this.categoryRepository.findAll();
    return this.buildTree(categories);
  }

  async getCategoryById(id: string): Promise<CategoryEntity | null> {
    return await this.categoryRepository.findById(id);
  }

  async updateCategory(
    id: string,
    name: string,
    description?: string
  ): Promise<CategoryEntity | null> {
    return await this.categoryRepository.update(id, { name, description });
  }

  async deleteCategory(id: string): Promise<void> {
    // Try to find category (optional)
    const category = await this.categoryRepository.findById(id);

    if (category) {
      // Delete descendants only if category exists
      const descendants = await this.categoryRepository.findDescendants(
        category.path
      );

      for (const desc of descendants) {
        await this.categoryRepository.delete(desc.id);
      }
    }

    // Always attempt delete (safe even if already deleted)
    await this.categoryRepository.delete(id);
  }

  private buildTree(categories: CategoryEntity[]): any[] {
    const map: any = {};
    const roots: any[] = [];

    categories.forEach((cat) => {
      map[cat.id] = { ...cat, children: [] };
    });

    categories.forEach((cat) => {
      if (cat.parentId && map[cat.parentId]) {
        map[cat.parentId].children.push(map[cat.id]);
      } else {
        roots.push(map[cat.id]);
      }
    });

    return roots;
  }
}
