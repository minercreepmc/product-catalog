import type { ProductRO } from '@v2/product/ro';

export class CategoryRO {
  id: string;
  name: string;
  description: string;
  products: ProductRO[];
}

export class CategoryIncludeProductCountRO {
  id: string;
  name: string;
  product_count: number;
}
