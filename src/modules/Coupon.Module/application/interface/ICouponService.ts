import { CouponResponseDTO, CouponValidationDTO, CreateCouponDTO, UpdateCouponDTO } from "../DTOs/CouponDTO";

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
