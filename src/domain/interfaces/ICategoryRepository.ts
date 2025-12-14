// import { Category } from "../entities/Category.entity";
// import { IRepository } from "./IRepository";

// export interface ICategoryRepository extends IRepository<Category> {
//   findByName(name: string): Promise<Category | null>;
//   findActive(): Promise<Category[]>;
//   findRoots(): Promise<Category[]>;
//   findChildren(parentId: string): Promise<Category[]>;
//   findDescendants(categoryPath: string): Promise<Category[]>;
//   findAncestors(categoryPath: string, categoryId: string): Promise<Category[]>;
//   findByLevel(level: number): Promise<Category[]>;
//   hasChildren(categoryId: string): Promise<boolean>;
//   updateDescendantPaths(oldPath: string, newPath: string): Promise<number>;
// }
import { Category } from "../entities/Category.entity";
import { IRepository } from "./IRepository";

export interface ICategoryRepository extends IRepository<Category> {
  findByName(name: string): Promise<Category | null>;
  findActive(): Promise<Category[]>;
  findByParentId(parentId: string | null): Promise<Category[]>;
  findByLevel(level: number): Promise<Category[]>;
  findRootCategories(): Promise<Category[]>;
  findChildCategories(parentId: string): Promise<Category[]>;
  findByPath(path: string): Promise<Category | null>;
}