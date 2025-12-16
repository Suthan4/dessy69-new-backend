import {Request,Response} from "express";
import { CouponService } from "../../application/services/Coupon.service";

export class CouponController {
  constructor(private couponService: CouponService) {}

  createCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const coupon = await this.couponService.createCoupon(req.body);
      res.status(201).json({ success: true, data: coupon });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  validateCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code, orderAmount, productIds, categoryIds } = req.body;
      const result = await this.couponService.validateAndApplyCoupon(
        code,
        orderAmount,
        productIds || [],
        categoryIds || []
      );
      res.json({ success: result.valid, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getCoupons = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.couponService.getAllCoupons(page, limit);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getCouponById = async (req: Request, res: Response): Promise<void> => {
    try {
      const coupon = await this.couponService.getCouponById(req.params.id as string);
      if (!coupon) {
        res.status(404).json({ success: false, message: "Coupon not found" });
        return;
      }
      res.json({ success: true, data: coupon });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const coupon = await this.couponService.updateCoupon(
        req.params.id as string,
        req.body
      );
      if (!coupon) {
        res.status(404).json({ success: false, message: "Coupon not found" });
        return;
      }
      res.json({ success: true, data: coupon });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.couponService.deleteCoupon(req.params.id as string);
      if (!result) {
        res.status(404).json({ success: false, message: "Coupon not found" });
        return;
      }
      res.json({ success: true, message: "Coupon deleted" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
