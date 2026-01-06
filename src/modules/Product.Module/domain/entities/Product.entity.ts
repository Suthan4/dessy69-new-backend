export interface ProductVariant {
  id: string;
  name: string; // e.g., "Small Cup", "Large Tub"
  size: string; // e.g., "250ml", "1L"
  basePrice: number;
  sellingPrice: number;
  isAvailable: boolean;
}
export interface Ingredient {
  id: string;
  name: string;
  quantity?: string;
  isOptional: boolean;
  additionalPrice?: number;
  allergens?: string[];
}

export class ProductEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly categoryId: string,
    public readonly basePrice: number,
    public readonly sellingPrice: number,
    public readonly isAvailable: boolean,
    public readonly variants: ProductVariant[],
    public readonly images: string[],
    public readonly ingredients: Ingredient[],
    public readonly nutritionInfo?: any,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  public isInStock(): boolean {
    return this.isAvailable || this.variants.some((v) => v.isAvailable);
  }

  public getLowestPrice(): number {
    if (this.variants.length === 0) return this.sellingPrice;
    const prices = this.variants
      .filter((v) => v.isAvailable)
      .map((v) => v.sellingPrice);
    return prices.length > 0 ? Math.min(...prices) : this.sellingPrice;
  }

  public calculateDiscount(): number {
    return ((this.basePrice - this.sellingPrice) / this.basePrice) * 100;
  }

  public static create(
    name: string,
    slug: string,
    description: string,
    categoryId: string,
    basePrice: number,
    sellingPrice: number,
    variants: ProductVariant[] = [],
    images: string[] = [],
    ingredients: Ingredient[] = []
  ): ProductEntity {
    return new ProductEntity(
      "",
      name.trim(),
      slug.toLowerCase(),
      description,
      categoryId,
      basePrice,
      sellingPrice,
      true,
      variants,
      images,
      ingredients
    );
  }
}
