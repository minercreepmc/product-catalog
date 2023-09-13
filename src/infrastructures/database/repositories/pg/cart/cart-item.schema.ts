import { SchemaBase } from '@base/database/repositories/pg';
import type { ProductSchema } from '../product';

export class CartItemSchema extends SchemaBase {
  cart_id: string;
  amount: number;
  product_id: string;
  name: string;
  price: number;
  discount: number;
  total_price: number;
  image_url: string;
}

export class CartItemDetailsSchema extends CartItemSchema {
  product?: Partial<ProductSchema>;
}
