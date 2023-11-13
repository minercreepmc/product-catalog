import { Generated } from 'kysely';

export class ShippingModel {
  id: Generated<string>;
  order_id: string;
  shipper_id: string;
  due_date: Date;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}
