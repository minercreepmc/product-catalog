import type { V1CartItemModel, V1CartModel } from './models';

export class V1GetCartHttpResponse implements V1CartModel {
  id: string;
  user_id: string;
  items: V1CartItemModel[];
  total_price: number;
}
