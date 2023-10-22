import type { OrderItemRO } from '@v2/order-item/ro';
import { OrderModel } from '../model';

export class OrderRO {
  id: string;
  status: string;
  total_price: number;
  fee_name: string;
  fee_price: number;
  address_location: string;
  member_name: string;
  member_phone: string;
  updated_at: Date;
}

export class OrderDetailsRO extends OrderRO {
  items: OrderItemRO[];
}

export class CreateOrderRO extends OrderModel {
  itemIds: string[];
  cartId: string;
}
