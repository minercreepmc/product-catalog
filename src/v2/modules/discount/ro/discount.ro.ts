import type { ProductWithImagesRO } from '@v2/product/ro';

export class DiscountRO {
  id: string;
  name: string;
  description: string;
  percentage: number;
  products: ProductWithImagesRO[];
}

export class DiscountIncludeProductCountRO {
  id: string;
  name: string;
  description: string;
  percentage: number;
  product_count: number;
}
