import { DomainEventBase } from '@base/domain';
import { CategoryIdValueObject } from '@value-objects/category';

export interface CategoryRemovedDomainEventDetails {
  id: CategoryIdValueObject;
}

export class CategoryRemovedDomainEvent
  extends DomainEventBase
  implements CategoryRemovedDomainEventDetails
{
  constructor(options: CategoryRemovedDomainEventDetails) {
    super({
      eventName: CategoryRemovedDomainEvent.name,
      entityType: CategoryRemovedDomainEvent.name,
    });
    this.id = options.id;
  }
  readonly id: CategoryIdValueObject;
}
