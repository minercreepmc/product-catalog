import type { AddressModel } from '@v2/address/model';
import type { CartItemRO } from '@v2/cart-item/ro';

export class CartRO {
  id: string;
  shippingFee?: number;
  total_price: number;
  address: AddressModel;
  items: CartItemRO[];
}
