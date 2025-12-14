import {
  AuthResponseDTO,
  LoginDTO,
  RegisterDTO,
  UserResponseDTO,
} from "../dtos/AuthDTO";
import { CategoryBreadcrumbDTO, CategoryResponseDTO, CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/CategoryDTO";
import {
  CouponResponseDTO,
  CouponValidationDTO,
  CreateCouponDTO,
  UpdateCouponDTO,
} from "../dtos/CouponDTO";
import {
  CreateOrderDTO,
  OrderResponseDTO,
  OrderStatisticsDTO,
} from "../dtos/OrderDTO";
import {
  CreateProductDTO,
  ProductResponseDTO,
  UpdateProductDTO,
} from "../dtos/ProductDTO";

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

export interface IOrderService {
  createOrder(orderData: CreateOrderDTO): Promise<OrderResponseDTO>;
  getOrderById(id: string): Promise<OrderResponseDTO>;
  getOrderByOrderId(orderId: string): Promise<OrderResponseDTO>;
  getUserOrders(phone: string): Promise<OrderResponseDTO[]>;
  getAllOrders(): Promise<OrderResponseDTO[]>;
  updateOrderStatus(
    orderId: string,
    status: string,
    notes?: string,
    estimatedTime?: number
  ): Promise<OrderResponseDTO>;
  updatePaymentStatus(
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<OrderResponseDTO>;
  cancelOrder(orderId: string, reason: string): Promise<OrderResponseDTO>;
  getTodayOrders(): Promise<OrderResponseDTO[]>;
  getOrderStatistics(
    startDate: Date,
    endDate: Date
  ): Promise<OrderStatisticsDTO[]>;
  getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    todayOrders: number;
  }>;
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

export interface ICategoryService {
  createCategory(data: CreateCategoryDTO): Promise<CategoryResponseDTO>;
  getAllCategories(includeInactive?: boolean): Promise<CategoryResponseDTO[]>;
  getCategoryById(id: string): Promise<CategoryResponseDTO>;
  updateCategory(
    id: string,
    data: UpdateCategoryDTO
  ): Promise<CategoryResponseDTO>;
  getCategoryBreadcrumb(categoryId: string): Promise<CategoryBreadcrumbDTO[]>;
  deleteCategory(id: string): Promise<boolean>;
  getRootCategories(): Promise<CategoryResponseDTO[]>;
  getChildCategories(parentId: string): Promise<CategoryResponseDTO[]>;
  getCategoryHierarchy(): Promise<any>;
}
