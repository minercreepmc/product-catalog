import { CartAggregate } from '@aggregates/cart';
import { DomainEventBase } from '@base/domain';
import { CartIdValueObject } from '@value-objects/cart';
import { UserIdValueObject } from '@value-objects/user';

export interface CartCreatedDomainEventDetails {
  id: CartIdValueObject;
  userId: UserIdValueObject;
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
  }
  id: CartIdValueObject;
  userId: UserIdValueObject;
}
