import { Generated } from 'kysely';

export class ShippingMethodModel {
  id: Generated<string>;
  name: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  deleted_at: Generated<Date>;
}
