import { SchemaBase } from '@base/database/repositories/pg';

export class ProductSchema extends SchemaBase {
  name: string;
  price: number;
  sold: number;
  description?: string;
  image_url?: string;
  discount_id?: string;
  category_ids?: string[];
}

export class ProductWithDiscountSchema extends ProductSchema {
  discount: {
    id: string;
    name: string;
    description?: string;
    percentage: number;
    active?: boolean;
  };
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
