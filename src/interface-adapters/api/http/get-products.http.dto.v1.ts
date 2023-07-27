import { ProductModel } from './models';
import { PaginationParams } from './query';

export class V1GetProductsHttpQuery extends PaginationParams {
  discount_id?: string;
}
export class V1GetProductsHttpResponse {
  products: ProductModel[];
}
