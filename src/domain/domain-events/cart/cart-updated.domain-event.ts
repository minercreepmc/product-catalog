import { CartAggregate } from '@aggregates/cart';
import { DomainEventBase } from '@base/domain';
import { CartItemEntity } from '@entities';
import { CartIdValueObject } from '@value-objects/cart';

export interface CartUpdatedDomainEventDetails {
  id: CartIdValueObject;
  items: CartItemEntity[];
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
  }
  id: CartIdValueObject;
  items: CartItemEntity[];
}
