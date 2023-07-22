import { PaginationParams } from '@base/use-cases/query-handler';

export class V1GetProductsHttpQuery extends PaginationParams {
  filter?: number;
  offset?: number;
}
