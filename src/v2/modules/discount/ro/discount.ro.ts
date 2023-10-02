import type { ProductRO } from '@v2/product/ro';

export class DiscountRO {
  id: string;
  name: string;
  description: string;
  percentage: number;
  products: ProductRO[];
}
