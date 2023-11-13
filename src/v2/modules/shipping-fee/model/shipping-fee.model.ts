import { Generated } from 'kysely';

export class ShippingFeeModel {
  id: Generated<string>;
  name: string;
  fee: number;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  deleted_at: Generated<Date>;
}
