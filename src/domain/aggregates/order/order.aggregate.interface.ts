import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderStatusValueObject,
  OrderTotalPriceValueObject,
} from '@value-objects/order';
import { UserIdValueObject } from '@value-objects/user';

export interface OrderAggregateDetails {
  id: OrderIdValueObject;
  address: OrderAddressValueObject;
  status: OrderStatusValueObject;
  totalPrice: OrderTotalPriceValueObject;
  userId: UserIdValueObject;
}

export interface CreateOrderAggregateOptions {
  address: OrderAddressValueObject;
  userId: UserIdValueObject;
  totalPrice: OrderTotalPriceValueObject;
}

export interface UpdateOrderAggregateOptions {
  address?: OrderAddressValueObject;
  status?: OrderStatusValueObject;
}
