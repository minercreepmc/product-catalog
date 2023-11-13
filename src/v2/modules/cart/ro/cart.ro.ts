import type { AddressModel } from '@v2/address/model';
import type { CartItemRO } from '@v2/cart-item/ro';
import { Expose } from 'class-transformer';

export class CartRO {
  id: string;
  shipping_fee?: number;
  total_price: number;
  address: AddressModel;
  items: CartItemRO[];
}

export class CartGetByUserIdRO {
  @Expose()
  id: string;

  @Expose()
  shippingFee?: number;

  @Expose()
  total_price: number;

  @Expose()
  address: AddressModel;

  @Expose()
  items: CartItemRO[];
}

export class CartUpdateRO {
  @Expose()
  id: string;

  @Expose()
  shippingFee?: number;

  @Expose()
  total_price: number;

  @Expose()
  address: AddressModel;
}
