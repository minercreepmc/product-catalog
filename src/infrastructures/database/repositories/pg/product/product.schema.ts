import { SchemaBase } from '@base/database/repositories/pg';

export class ProductSchema extends SchemaBase {
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  discount_id?: string;
  category_ids?: string[];
}

export class ProductWithDiscountSchema extends ProductSchema {
  discount_id: string;
  discount_name: string;
  discount_description?: string;
  discount_percentage: number;
  discount_active?: boolean;
}
