import { CategoryIdValueObject } from '@value-objects/category';
import { DomainEvent } from 'common-base-classes';

export interface CategoryRemovedDomainEventOptions {
  id: CategoryIdValueObject;
}

export class CategoryRemovedDomainEvent extends DomainEvent<object> {
  constructor(options: CategoryRemovedDomainEventOptions) {
    super({
      eventName: CategoryRemovedDomainEvent.name,
      entityType: CategoryRemovedDomainEvent.name,
      eventDetails: options,
      entityId: options.id,
    });
  }

  get categoryId() {
    return this.entityId;
  }
}
