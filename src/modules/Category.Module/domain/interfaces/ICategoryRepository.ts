import { CategoryEntity } from "../entities/Category.entity";
import { IRepository } from "./IRepository";

export interface ICategoryRepository extends IRepository<CategoryEntity> {
  findBySlug(slug: string): Promise<CategoryEntity | null>;
  findByPath(path: string): Promise<CategoryEntity[]>;
  findChildren(parentId: string): Promise<CategoryEntity[]>;
  findDescendants(path: string): Promise<CategoryEntity[]>; // All children, grandchildren, etc.
}