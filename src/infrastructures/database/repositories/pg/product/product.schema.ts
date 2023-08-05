import { SchemaBase } from '@base/database/repositories/pg';

export class ProductSchema extends SchemaBase {
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  discount_id?: string;
  category_ids?: string[];
}

export class ProductWithDetailsSchema extends ProductSchema {
  discount: {
    id: string;
    name: string;
    description?: string;
    percentage: number;
    active?: boolean;
  };
  categories: {
    id: string;
    name: string;
    description?: string;
  }[];
}
