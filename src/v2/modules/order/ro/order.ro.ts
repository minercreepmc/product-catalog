import { PaginateRO } from '@common/ro';
import type { OrderItemRO } from '@v2/order-item/ro';
import { Expose, Type } from 'class-transformer';
import { Generated } from 'kysely';
import { OrderStatus } from '../constants';
import { OrderModel } from '../model';

export class OrderGetAllDataRO {
  @Expose()
  id: string;

  @Expose()
  status: string;

  @Expose()
  total_price: number;

  @Expose()
  fee_name: string;

  @Expose()
  fee_price: number;

  @Expose()
  shipping_method: string;

  @Expose()
  address_location: string;

  @Expose()
  member_name?: string | undefined;

  @Expose()
  member_phone?: string | undefined;

  @Expose()
  created_at: Date;
}

export class OrderGetAllRO extends PaginateRO<OrderGetAllDataRO> {
  @Expose()
  @Type(() => OrderGetAllDataRO)
  data: OrderGetAllDataRO[];
}

export class OrderGetDetailsRO extends OrderGetAllDataRO {
  @Expose()
  items: OrderItemRO[];
}

export class CreateOrderRO implements OrderModel {
  @Expose()
  id: Generated<string>;

  @Expose()
  status: OrderStatus;

  @Expose()
  address_id: string;

  @Expose()
  total_price: number;

  @Expose()
  shipping_fee_id: string;

  @Expose()
  shipping_method_id: string;

  @Expose()
  member_id: string;

  @Expose()
  created_at: Generated<Date>;

  @Expose()
  updated_at: Generated<Date>;

  @Expose()
  itemIds: string[];

  @Expose()
  cartId: string;
}
