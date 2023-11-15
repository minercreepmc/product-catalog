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
  shipping_fee?: number;

  @Expose()
  shipping_fee_id?: string;

  @Expose()
  total_price: bigint;

  @Expose()
  address_id?: string;

  @Expose()
  shipping_method_id?: string;

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
