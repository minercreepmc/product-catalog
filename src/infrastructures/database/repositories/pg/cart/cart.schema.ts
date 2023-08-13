import { SchemaBase } from '@base/database/repositories/pg';
import type { UserSchema } from '../user';
import type { CartItemDetailsSchema, CartItemSchema } from './cart-item.schema';

export class CartSchema extends SchemaBase {
  user_id: string;
  item_ids: string[];
}

export class CartDetailsSchema extends CartSchema {
  user?: UserSchema;
  items?: Partial<CartItemSchema | CartItemDetailsSchema>[];
}
