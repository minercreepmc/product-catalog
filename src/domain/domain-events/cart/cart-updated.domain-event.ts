import { CartAggregate } from '@aggregates/cart';
import { DomainEventBase } from '@base/domain';
import { CartItemEntity } from '@entities';
import { CartIdValueObject, CartPriceValueObject } from '@value-objects/cart';
import { UserIdValueObject } from '@value-objects/user';

export interface CartUpdatedDomainEventDetails {
  id: CartIdValueObject;
  items: CartItemEntity[];
  totalPrice: CartPriceValueObject;
  userId: UserIdValueObject;
}

export class CartUpdatedDomainEvent
  extends DomainEventBase
  implements CartUpdatedDomainEventDetails
{
  constructor(options: CartUpdatedDomainEventDetails) {
    super({
      eventName: CartUpdatedDomainEvent.name,
      entityType: CartAggregate.name,
    });
    this.id = options.id;
    this.items = options.items;
    this.userId = options.userId;
    this.totalPrice = options.totalPrice;
  }
  id: CartIdValueObject;
  items: CartItemEntity[];
  userId: UserIdValueObject;
  totalPrice: CartPriceValueObject;
}
