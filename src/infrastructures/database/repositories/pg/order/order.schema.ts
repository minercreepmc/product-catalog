import { SchemaBase } from '@base/database/repositories/pg';
import { OrderStatusEnum } from '@value-objects/order';
import type { ProductSchema } from '../product';

export class OrderSchema extends SchemaBase {
  user_id: string;
  address: string;
  status: OrderStatusEnum;
  total_price: number;
  product_ids: string[];
}

export class OrderWithDetailsSchema extends OrderSchema {
  products: ProductSchema[];
}
