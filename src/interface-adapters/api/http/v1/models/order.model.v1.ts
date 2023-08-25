import { OrderSchema } from '@database/repositories/pg/order';
import { OrderStatusEnum } from '@value-objects/order';

export class V1OrderModel implements OrderSchema {
  user_id: string;
  cart_id: string;
  address: string;
  status: OrderStatusEnum;
  id: string;
}
