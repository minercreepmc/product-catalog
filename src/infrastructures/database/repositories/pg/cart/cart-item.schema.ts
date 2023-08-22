import { SchemaBase } from '@base/database/repositories/pg';
import type { ProductSchema } from '../product';

export class CartItemSchema extends SchemaBase {
  cart_id: string;
  amount: number;
  product_id: string;
}

export class CartItemDetailsSchema extends CartItemSchema {
  product?: Partial<ProductSchema>;
}
