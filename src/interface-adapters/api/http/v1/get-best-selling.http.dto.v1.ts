import { V1ProductModel } from './models';

export class V1GetBestSellingHttpQuery {
  limit?: number;
  offset?: number;
}

export class V1GetBestSellingHttpResponse {
  products: V1ProductModel[];
}
