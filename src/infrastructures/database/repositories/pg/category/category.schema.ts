import { SchemaBase } from '@base/database/repositories/pg';

export class CategorySchema extends SchemaBase {
  name: string;
  description?: string;
  product_ids?: string[];
}
