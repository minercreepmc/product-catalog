export class OrderModel {
  id: string;
  status: string;
  total_price: number;
  shipping_fee_id: string;
  member_id: string;
  address_id: string;
  created_at: Date;
  updated_at: Date;
}
