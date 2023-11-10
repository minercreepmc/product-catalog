import { AddressModel } from '@v2/address/model';
import { OrderModel } from '@v2/order/model';
import { ShippingFeeModel } from '@v2/shipping-fee/model';
import { UserModel } from '@v2/users/model';
import { Kysely } from 'kysely';

interface Tables {
  order_details: OrderModel;
  address: AddressModel;
  shipping_fee: ShippingFeeModel;
  users: UserModel;
}

export class KyselyDatabase extends Kysely<Tables> {}
