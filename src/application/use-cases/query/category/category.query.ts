import { PaginationParams } from '@base/use-cases/query-handler';
import { CategorySchema } from '@database/repositories/pg/category';

export class CategoryQuery
  implements Partial<CategorySchema>, PaginationParams
{
  name?: string;
  description?: string;
  id?: string;
  offset?: number;
  limit?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  constructor(options: CategoryQuery) {
    this.name = options.name;
    this.description = options.description;
    this.id = options.id;
    this.offset = options.offset;
    this.limit = options.limit;
    this.created_at = options.created_at;
    this.updated_at = options.updated_at;
    this.deleted_at = options.deleted_at;
  }
}
