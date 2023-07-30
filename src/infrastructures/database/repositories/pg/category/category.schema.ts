import { SchemaBase } from '@base/database/repositories/pg';

export class CategorySchema extends SchemaBase {
  name: string;
  description?: string;
  product_ids?: string[];
}

export class CategorySchemaWithProducts extends CategorySchema {
  products: {
    product_id: string;
    product_name: string;
    product_price: number;
  };
}
