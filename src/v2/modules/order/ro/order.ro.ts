import type { OrderItemRO } from '@v2/order-item/ro';
import { Expose } from 'class-transformer';
import { OrderModel } from '../model';

export class OrderRO {
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
  address_location: string;

  @Expose()
  member_name: string;

  @Expose()
  member_phone: string;

  @Expose()
  updated_at: Date;
}

export class OrderDetailsRO extends OrderRO {
  @Expose()
  items: OrderItemRO[];
}

export class CreateOrderRO extends OrderModel {
  @Expose()
  itemIds: string[];

  @Expose()
  cartId: string;
}
