import { Generated } from 'kysely';

export class CartModel {
  id: Generated<string>;
  shipping_fee_id?: string | null;
  shipping_method_id?: string | null;
  address_id?: string | null;
  total_price?: bigint | null;
  user_id: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}
