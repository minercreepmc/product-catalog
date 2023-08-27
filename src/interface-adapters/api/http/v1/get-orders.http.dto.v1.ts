import { V1OrderModel } from './models';

export class V1GetOrdersHttpQuery {
  limit?: number;
  offset?: number;
}
export type V1GetOrdersHttpResponse = {
  orders: V1OrderModel[];
  total_price: number;
};
