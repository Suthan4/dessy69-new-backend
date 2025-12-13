import { AuthResponseDTO, LoginDTO, RegisterDTO, UserResponseDTO } from "../dtos/AuthDTO";
import { CouponResponseDTO, CouponValidationDTO, CreateCouponDTO, UpdateCouponDTO } from "../dtos/CouponDTO";
import { CreateOrderDTO, OrderResponseDTO, OrderStatisticsDTO } from "../dtos/OrderDTO";
import { CreateProductDTO, ProductResponseDTO, UpdateProductDTO } from "../dtos/ProductDTO";

export interface IProductService {
  getAllProducts(): Promise<ProductResponseDTO[]>;
  getProductById(id: string): Promise<ProductResponseDTO>;
  createProduct(data: CreateProductDTO): Promise<ProductResponseDTO>;
  updateProduct(
    id: string,
    data: UpdateProductDTO
  ): Promise<ProductResponseDTO>;
  deleteProduct(id: string): Promise<boolean>;
  getProductsByCategory(category: string): Promise<ProductResponseDTO[]>;
  getPopularProducts(): Promise<ProductResponseDTO[]>;
  updateAvailability(id: string, status: boolean): Promise<boolean>;
  searchProducts(query: string): Promise<ProductResponseDTO[]>;
}

export interface IOrderService {
  createOrder(
    userId: string,
    orderData: CreateOrderDTO
  ): Promise<OrderResponseDTO>;
  getOrderById(id: string): Promise<OrderResponseDTO>;
  getUserOrders(userId: string): Promise<OrderResponseDTO[]>;
  getAllOrders(): Promise<OrderResponseDTO[]>;
  updateOrderStatus(id: string, status: string): Promise<OrderResponseDTO>;
  cancelOrder(id: string, reason: string): Promise<OrderResponseDTO>;
  getTodayOrders(): Promise<OrderResponseDTO[]>;
  getOrderStatistics(
    startDate: Date,
    endDate: Date
  ): Promise<OrderStatisticsDTO[]>;
}

export interface ICouponService {
  createCoupon(data: CreateCouponDTO): Promise<CouponResponseDTO>;
  getAllCoupons(): Promise<CouponResponseDTO[]>;
  getCouponByCode(code: string): Promise<CouponResponseDTO>;
  validateCoupon(
    code: string,
    orderAmount: number
  ): Promise<CouponValidationDTO>;
  applyCoupon(code: string, orderAmount: number): Promise<number>;
  updateCoupon(id: string, data: UpdateCouponDTO): Promise<CouponResponseDTO>;
  deleteCoupon(id: string): Promise<boolean>;
}

export interface IAuthService {
  register(data: RegisterDTO): Promise<AuthResponseDTO>;
  login(credentials: LoginDTO): Promise<AuthResponseDTO>;
  verifyToken(token: string): Promise<UserResponseDTO>;
}
