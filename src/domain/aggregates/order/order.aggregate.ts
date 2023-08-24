import { AggregateRootBase } from '@base/domain';
import {
  OrderCreatedDomainEvent,
  OrderUpdatedDomainEvent,
} from '@domain-events/order';
import { CartIdValueObject } from '@value-objects/cart';
import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderStatusValueObject,
} from '@value-objects/order';
import { UserIdValueObject } from '@value-objects/user';
import {
  CreateOrderAggregateOptions,
  OrderAggregateDetails,
  UpdateOrderAggregateOptions,
} from './order.aggregate.interface';

export class OrderAggregate
  implements AggregateRootBase, OrderAggregateDetails
{
  id: OrderIdValueObject;
  address: OrderAddressValueObject;
  status: OrderStatusValueObject;
  userId: UserIdValueObject;
  cartId: CartIdValueObject;

  constructor(options?: OrderAggregateDetails) {
    if (options) {
      this.id = options.id;
      this.address = options.address;
      this.userId = options.userId;
      this.cartId = options.cartId;
    } else {
      this.id = new OrderIdValueObject();
    }
  }

  createOrder(options: CreateOrderAggregateOptions) {
    this.cartId = options.cartId;
    this.address = options.address;
    this.userId = options.userId;
    this.status = OrderStatusValueObject.processing();

    return new OrderCreatedDomainEvent({
      id: this.id,
      userId: this.userId,
      cartId: this.cartId,
      address: this.address,
    });
  }

  updateOrder(options: UpdateOrderAggregateOptions) {
    const { address, status } = options;

    if (address) {
      this.address = address;
    }

    if (status) {
      this.status = status;
    }

    return new OrderUpdatedDomainEvent({
      id: this.id,
      address: this.address,
      status: this.status,
    });
  }
}
