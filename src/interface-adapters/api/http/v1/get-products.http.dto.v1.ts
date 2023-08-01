import { V1ProductModel } from './models';
import { ByCategory, ByDiscount, PaginationParams } from './query';

export class V1GetProductsHttpQuery implements PaginationParams, ByDiscount {
  limit?: number;
  offset?: number;
  discount_id?: string;
}
export class V1GetProductsHttpResponse {
  products: V1ProductModel[];
}
