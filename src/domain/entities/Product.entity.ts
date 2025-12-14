import { Types } from "mongoose";

export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public categoryId: Types.ObjectId,
    public image: string,
    public variants: ProductVariant[],
    public isAvailable: boolean,
    public popularity: number,
    public tags: string[],
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  updateAvailability(status: boolean): void {
    this.isAvailable = status;
    this.updatedAt = new Date();
  }

  addVariant(variant: ProductVariant): void {
    this.variants.push(variant);
    this.updatedAt = new Date();
  }

  incrementPopularity(): void {
    this.popularity += 1;
    this.updatedAt = new Date();
  }
}

export class ProductVariant {
  constructor(
    public name: string,
    public price: number,
    public isAvailable: boolean = true
  ) {}
}
