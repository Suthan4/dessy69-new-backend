import { CreateProductDTO, ProductResponseDTO, UpdateProductDTO } from "../DTOs/ProductDTO";


export interface IProductService {
  getAllProducts(): Promise<ProductResponseDTO[]>;
  getProductById(id: string): Promise<ProductResponseDTO>;
  createProduct(data: CreateProductDTO): Promise<ProductResponseDTO>;
  updateProduct(
    id: string,
    data: UpdateProductDTO
  ): Promise<ProductResponseDTO>;
  deleteProduct(id: string): Promise<boolean>;
  getProductsByCategory(categoryId: string): Promise<ProductResponseDTO[]>;
  getPopularProducts(): Promise<ProductResponseDTO[]>;
  updateAvailability(id: string, status: boolean): Promise<boolean>;
  searchProducts(query: string): Promise<ProductResponseDTO[]>;
}
