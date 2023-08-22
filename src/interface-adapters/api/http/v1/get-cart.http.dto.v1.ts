import type { V1CartItemModel } from './models';

export class V1GetCartHttpResponse {
  items: Partial<V1CartItemModel>[];
  user_id: string;
  id: string;
}
