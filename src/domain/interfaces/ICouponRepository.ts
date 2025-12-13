import { Coupon } from "../entities/Coupon.entity";
import { IRepository } from "./IRepository";

export interface ICouponRepository extends IRepository<Coupon> {
  findByCode(code: string): Promise<Coupon | null>;
  findActive():Promise<Coupon[]>
  incerementUsage(id:string):Promise<boolean>;
}
