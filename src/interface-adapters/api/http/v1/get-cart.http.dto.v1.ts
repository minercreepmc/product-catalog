import type { V1CartItemModel } from './models';

export class V1GetCartHttpResponse {
  total_price: number;
  items: Partial<V1CartItemModel>[];
  user_id: string;
  id: string;
}
