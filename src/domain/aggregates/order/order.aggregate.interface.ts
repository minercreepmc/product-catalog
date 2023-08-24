import { CartIdValueObject } from '@value-objects/cart';
import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderStatusValueObject,
} from '@value-objects/order';
import { UserIdValueObject } from '@value-objects/user';

export interface OrderAggregateDetails {
  id: OrderIdValueObject;
  address: OrderAddressValueObject;
  status: OrderStatusValueObject;
  userId: UserIdValueObject;
  cartId: CartIdValueObject;
}

export interface CreateOrderAggregateOptions {
  address: OrderAddressValueObject;
  userId: UserIdValueObject;
  cartId: CartIdValueObject;
}
