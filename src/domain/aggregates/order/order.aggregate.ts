import { AggregateRootBase } from '@base/domain';
import {
  OrderCreatedDomainEvent,
  OrderUpdatedDomainEvent,
} from '@domain-events/order';
import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderStatusValueObject,
  OrderTotalPriceValueObject,
} from '@value-objects/order';
import { ProductIdValueObject } from '@value-objects/product';
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
  totalPrice: OrderTotalPriceValueObject;
  userId: UserIdValueObject;
  productIds: ProductIdValueObject[];

  constructor(options?: OrderAggregateDetails) {
    if (options) {
      this.id = options.id;
      this.address = options.address;
      this.userId = options.userId;
      this.productIds = options.productIds;
    } else {
      this.id = new OrderIdValueObject();
    }
  }

  createOrder(options: CreateOrderAggregateOptions) {
    this.address = options.address;
    this.userId = options.userId;
    this.status = OrderStatusValueObject.processing();
    this.totalPrice = options.totalPrice;
    this.productIds = options.productIds;

    return new OrderCreatedDomainEvent({
      id: this.id,
      userId: this.userId,
      address: this.address,
      totalPrice: this.totalPrice,
      productIds: this.productIds,
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
