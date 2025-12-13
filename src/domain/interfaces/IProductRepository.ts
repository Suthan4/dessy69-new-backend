import { Product } from "../entities/Product.entity";
import { IRepository } from "./IRepository";

export interface IProductRepository extends IRepository<Product> {
  findByCategory(category: string): Promise<Product[]>;
  findByPopular():Promise<Product[]>;
  findAvailable():Promise<Product[]>;
  updateAvailability(id:string,status:boolean):Promise<boolean>;
  searchProducts(query:string):Promise<Product[]>
}
