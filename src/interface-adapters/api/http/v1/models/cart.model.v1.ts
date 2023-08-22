import type { V1ProductModel } from './product.model.v1';

export class V1CartModel {
  user_id: string;
  items: V1CartItemModel[];
}

export class V1CartItemModel {
  amount: number;
  product: V1ProductModel;
}
