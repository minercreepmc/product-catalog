import { Generated } from 'kysely';

export class AddressModel {
  id: Generated<string>;
  location: string;
  user_id: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  deleted_at: Generated<Date>;
}
