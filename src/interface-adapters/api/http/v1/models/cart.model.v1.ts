export class V1CartModel {
  id: string;
  user_id: string;
  items: V1CartItemModel[];
  total_price: number;
}

export class V1CartItemModel {
  name: string;
  price: number;
  product_id: string;
  total_price: number;
  image_url?: string;
  amount: number;
  discount: number;
}
