import { AddressModel } from '@v2/address/model';
import { CartItemModel } from '@v2/cart-item/model';
import { CartModel } from '@v2/cart/model';
import { DiscountModel } from '@v2/discount/model';
import { OrderModel } from '@v2/order/model';
import { ProductModel } from '@v2/product/model';
import { ShippingFeeModel } from '@v2/shipping-fee/model';
import { ShippingMethodModel } from '@v2/shipping-method/model';
import { ShippingModel } from '@v2/shipping/model';
import { UserModel } from '@v2/users/model';
import { Kysely } from 'kysely';

export interface KyselyTables {
  order_details: OrderModel;
  address: AddressModel;
  shipping_fee: ShippingFeeModel;
  users: UserModel;
  cart: CartModel;
  shipping_method: ShippingMethodModel;
  cart_item: CartItemModel;
  product: ProductModel;
  discount: DiscountModel;
  shipping: ShippingModel;
}

export class KyselyDatabase extends Kysely<KyselyTables> {}
