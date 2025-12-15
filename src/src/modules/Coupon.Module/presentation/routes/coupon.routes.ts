
import { Router } from "express";
import { CouponSchema } from "../validators/schema";
import { CouponService } from "@/modules/Coupon.Module/application/services/Coupon.service";
import { CouponRepository } from "@/modules/Coupon.Module/infrastructure/repositories/CouponRepository";
import { authenticate, authorizeAdmin } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validation.middleware";

export class CouponRoutes {
  public router: Router;
  private service: CouponService;

  constructor() {
    this.router = Router();
    const repository = new CouponRepository();
    this.service = new CouponService(repository);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Customer routes
    this.router.post("/validate", authenticate, async (req, res) => {
      try {
        const result = await this.service.validateCoupon(
          req.body.code,
          req.body.orderAmount
        );
        res.json({ success: true, data: result });
      } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
      }
    });

    // Admin routes
    this.router.get("/", authenticate, authorizeAdmin, async (req, res) => {
      try {
        const coupons = await this.service.getAllCoupons();
        res.json({ success: true, data: coupons });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    });

    this.router.post(
      "/",
      authenticate,
      authorizeAdmin,
      validate(CouponSchema),
      async (req, res) => {
        try {
          const coupon = await this.service.createCoupon(req.body);
          res.status(201).json({ success: true, data: coupon });
        } catch (error: any) {
          res.status(400).json({ success: false, message: error.message });
        }
      }
    );

    this.router.put("/:id", authenticate, authorizeAdmin, async (req, res) => {
      try {
        const coupon = await this.service.updateCoupon(req.params.id as string, req.body);
        res.json({ success: true, data: coupon });
      } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
      }
    });

    this.router.delete(
      "/:id",
      authenticate,
      authorizeAdmin,
      async (req, res) => {
        try {
          await this.service.deleteCoupon(req.params.id as string);
          res.json({ success: true, message: "Coupon deleted" });
        } catch (error: any) {
          res.status(400).json({ success: false, message: error.message });
        }
      }
    );
  }
}
