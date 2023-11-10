import { Expose } from 'class-transformer';

export class CartItemRO {
  @Expose()
  id: string;

  @Expose()
  amount: number;

  @Expose()
  product_id: string;

  @Expose()
  product_name: string;

  @Expose()
  product_price: number;

  @Expose()
  product_new_price: number;

  @Expose()
  discount_id?: string;

  @Expose()
  discount_percentage?: number;

  @Expose()
  image_urls: string[];
}
