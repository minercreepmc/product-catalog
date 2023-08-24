import { OrderAggregate } from '@aggregates/order';
import { DomainEventBase } from '@base/domain';
import { CartIdValueObject } from '@value-objects/cart';
import {
  OrderAddressValueObject,
  OrderIdValueObject,
} from '@value-objects/order';
import { UserIdValueObject } from '@value-objects/user';

export interface OrderCreatedDomainEventDetails {
  id: OrderIdValueObject;
  userId: UserIdValueObject;
  cartId: CartIdValueObject;
  address: OrderAddressValueObject;
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
    this.cartId = options.cartId;
    this.address = options.address;
  }

  id: OrderIdValueObject;
  userId: UserIdValueObject;
  cartId: CartIdValueObject;
  address: OrderAddressValueObject;
}
