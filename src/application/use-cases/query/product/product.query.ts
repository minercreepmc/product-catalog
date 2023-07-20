import { PaginationParams } from '@base/use-cases/query-handler';
import { ProductSchema } from '@database/repositories/pg/product';

export class ProductQuery implements Partial<ProductSchema>, PaginationParams {
  constructor(options: ProductQuery) {
    this.id = options.id;
    this.name = options.name;
    this.price = options.price;
    this.description = options.description;
    this.image_url = options.image_url;
    this.category_id = options.category_id;
    this.discount_id = options.discount_id;
    this.created_at = options.created_at;
    this.updated_at = options.updated_at;
    this.deleted_at = options.deleted_at;
    this.offset = options.offset;
    this.limit = options.limit;
  }
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
