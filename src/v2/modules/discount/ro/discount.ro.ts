import type { ProductRO } from '@v2/product/ro';

export class DiscountRO {
  id: string;
  name: string;
  description: string;
  percentage: number;
  products: ProductRO[];
}

export class DiscountIncludeProductCountRO {
  id: string;
  name: string;
  description: string;
  percentage: number;
  product_count: number;
}
