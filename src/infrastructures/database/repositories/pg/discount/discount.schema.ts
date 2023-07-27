import { SchemaBase } from '@base/database/repositories/pg';

export class DiscountSchema extends SchemaBase {
  name: string;
  description?: string;
  percentage: number;
  active: boolean;
}
