export class CartItemRO {
  id: string;
  amount: number;
  product_id: string;
  product_name: string;
  product_price: number;
  discount_id?: string;
  discount_percentage?: number;
}
