import { OrderAggregate } from '@aggregates/order';
import { DomainEventBase } from '@base/domain';
import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderTotalPriceValueObject,
} from '@value-objects/order';
import { UserIdValueObject } from '@value-objects/user';

export interface OrderCreatedDomainEventDetails {
  id: OrderIdValueObject;
  userId: UserIdValueObject;
  address: OrderAddressValueObject;
  totalPrice: OrderTotalPriceValueObject;
}

export class OrderCreatedDomainEvent
  extends DomainEventBase
  implements OrderCreatedDomainEventDetails
{
  constructor(options: OrderCreatedDomainEventDetails) {
    super({
      eventName: OrderCreatedDomainEvent.name,
      entityType: OrderAggregate.name,
    });
    this.id = options.id;
    this.userId = options.userId;
    this.address = options.address;
    this.totalPrice = options.totalPrice;
  }

  id: OrderIdValueObject;
  userId: UserIdValueObject;
  address: OrderAddressValueObject;
  totalPrice: OrderTotalPriceValueObject;
}
