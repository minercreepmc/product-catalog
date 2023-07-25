import { PaginationParams } from '@base/use-cases/query-handler';

export class ProductQuery implements PaginationParams {
  offset?: number;
  limit?: number;
  details?: boolean;
  discount_id?: string;
}
