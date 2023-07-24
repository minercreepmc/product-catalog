import { PaginationParams } from '@base/use-cases/query-handler';
import { ProductSchema } from '@database/repositories/pg/product';

export class ProductQuery implements Partial<ProductSchema>, PaginationParams {
  offset?: number;
  limit?: number;
  name?: string;
  price?: number;
  description?: string;
  image_url?: string;
  category_id?: string;
  discount_id?: string;
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
