import { SchemaBase } from '@base/database/repositories/pg';
import { DiscountSchema } from '../discount';
import type { ProductSchema } from '../product';

export class CartItemSchema extends SchemaBase {
  cart_id: string;
  amount: number;
  product_id: string;
  total_price: number;
}

export class CartItemDetailsSchema extends CartItemSchema {
  product: Partial<ProductSchema>;
  discount?: Partial<DiscountSchema>;
}
