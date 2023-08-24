import { CartAggregate } from '@aggregates/cart';
import { DomainEventBase } from '@base/domain';
import { CartIdValueObject, CartPriceValueObject } from '@value-objects/cart';
import { UserIdValueObject } from '@value-objects/user';

export interface CartCreatedDomainEventDetails {
  id: CartIdValueObject;
  userId: UserIdValueObject;
  totalPrice: CartPriceValueObject;
}

export class CartCreatedDomainEvent
  extends DomainEventBase
  implements CartCreatedDomainEventDetails
{
  constructor(options: CartCreatedDomainEventDetails) {
    super({
      eventName: CartCreatedDomainEvent.name,
      entityType: CartAggregate.name,
    });
    this.id = options.id;
    this.userId = options.userId;
    this.totalPrice = options.totalPrice;
  }
  id: CartIdValueObject;
  userId: UserIdValueObject;
  totalPrice: CartPriceValueObject;
}
