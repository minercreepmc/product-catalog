import { SchemaBase } from '@base/database/repositories/pg';
import type { ProductSchema } from '../product';

export class CartItemSchema extends SchemaBase {
  cart_id: string;
  amount: number;
  product?: ProductSchema;
}
