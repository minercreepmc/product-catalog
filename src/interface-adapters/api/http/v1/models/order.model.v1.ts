import { OrderSchema } from '@database/repositories/pg/order';
import { OrderStatusEnum } from '@value-objects/order';

export class V1OrderModel implements OrderSchema {
  product_ids: string[];
  user_id: string;
  address: string;
  status: OrderStatusEnum;
  total_price: number;
  id: string;
}
