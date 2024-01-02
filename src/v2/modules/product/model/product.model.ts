import { Generated } from 'kysely';

export class ProductModel {
  id: Generated<string>;
  name: string;
  description: string;
  price: number;
  discount_id?: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  deleted_at: Date;
}
