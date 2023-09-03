import { V1OrderModel } from './models';

export class V1GetOrdersByUserHttpRequest {
  limit?: number;
  offset?: number;
}

export class V1GetOrdersByUserHttpResponse {
  orders: V1OrderModel[];
}
