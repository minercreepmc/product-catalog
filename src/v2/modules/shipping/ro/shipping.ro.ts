import { PaginateRO } from '@common/ro';
import { Expose } from 'class-transformer';

export class ShippingRO {
  @Expose()
  id: string;

  @Expose()
  order_id: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  member_name: string;

  @Expose()
  member_phone: string;

  @Expose()
  status: string;

  @Expose()
  total_price: number;

  @Expose()
  fee_price: number;

  @Expose()
  fee_name: string;

  @Expose()
  address: string;

  @Expose()
  shipper_name: string;

  @Expose()
  shipper_phone: string;

  @Expose()
  due_date: string;
}

export class ShippingGetDetailRO extends ShippingRO {}
export class ShippingGetAllRO extends PaginateRO<ShippingRO> {
  @Expose()
  data: ShippingRO[];
}
