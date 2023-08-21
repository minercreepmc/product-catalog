export class CartModel {
  user_id: string;
  item_ids: string[];
  id: string;
}

export class CartItemModel {
  cart_id: string;
  amount: number;
  product_id: string;
  id: string;
}
