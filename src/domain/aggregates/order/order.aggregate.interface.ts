import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderStatusValueObject,
  OrderTotalPriceValueObject,
} from '@value-objects/order';
import { ProductIdValueObject } from '@value-objects/product';
import { UserIdValueObject } from '@value-objects/user';

export interface OrderAggregateDetails {
  id: OrderIdValueObject;
  address: OrderAddressValueObject;
  status: OrderStatusValueObject;
  totalPrice: OrderTotalPriceValueObject;
  userId: UserIdValueObject;
  productIds: ProductIdValueObject[];
}

export interface CreateOrderAggregateOptions {
  address: OrderAddressValueObject;
  userId: UserIdValueObject;
  totalPrice: OrderTotalPriceValueObject;
  productIds: ProductIdValueObject[];
}

export interface UpdateOrderAggregateOptions {
  address?: OrderAddressValueObject;
  status?: OrderStatusValueObject;
}
