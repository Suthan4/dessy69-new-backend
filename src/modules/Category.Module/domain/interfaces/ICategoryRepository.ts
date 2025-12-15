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