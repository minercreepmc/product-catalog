import { SchemaBase } from '@base/database/repositories/pg';
import { OrderStatusEnum } from '@value-objects/order';

export class OrderSchema extends SchemaBase {
  user_id: string;
  cart_id: string;
  address: string;
  status: OrderStatusEnum;
}
