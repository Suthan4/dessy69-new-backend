export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public category: string,
    public basePrice: number,
    public image: string,
    public variants: ProductVariant[],
    public isAvailable: boolean,
    public isPopular: boolean,
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
}

export class ProductVariant {
  constructor(
    public name: string,
    public additionalPrice: number,
    public isAvailable: boolean = true
  ) {}
}
