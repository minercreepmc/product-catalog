import { SchemaBase } from '@base/database/repositories/pg';
import type { UserSchema } from '../user';
import type { CartItemSchema } from './cart-item.schema';

export class CartSchema extends SchemaBase {
  userId: string;
  itemIds: string[];
}

export class CartDetailsSchema extends SchemaBase {
  user?: UserSchema;
  items?: CartItemSchema[];
}
