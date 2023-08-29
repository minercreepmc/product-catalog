import { V1ProductModel } from './models';

export class V1GetBestSellingHttpRequest {
  limit?: number;
  offset?: number;
}

export class V1GetBestSellingHttpResponse {
  products: V1ProductModel[];
}
