import { Generated } from 'kysely';
import { OrderStatus } from '../constants';

export class OrderModel {
  id: Generated<string>;
  status: OrderStatus;
  address_id: string;
  total_price: number;
  shipping_fee_id: string;
  shipping_method_id: string;
  member_id: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}
