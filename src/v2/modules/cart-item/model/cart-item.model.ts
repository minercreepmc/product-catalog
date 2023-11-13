import { Generated } from 'kysely';

export class CartItemModel {
  id: Generated<string>;
  amount: number;
  cart_id: string;
  product_id: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}
