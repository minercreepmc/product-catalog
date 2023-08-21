import { SchemaBase } from '@base/database/repositories/pg';
import type { CartItemDetailsSchema } from './cart-item.schema';

export class CartSchema extends SchemaBase {
  user_id: string;
  item_ids: string[];
}

export class CartDetailsSchema extends CartSchema {
  items: Partial<CartItemDetailsSchema>[];
}
