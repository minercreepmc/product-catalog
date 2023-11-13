import { Generated } from 'kysely';

export class DiscountModel {
  id: Generated<string>;
  name: string;
  description: string;
  percentage: number;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}
