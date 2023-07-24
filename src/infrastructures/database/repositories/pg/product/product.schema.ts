import { SchemaBase } from '@base/database/repositories/pg';

export class ProductSchema extends SchemaBase {
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  discount_id?: string;
  //category_id: string;
}
