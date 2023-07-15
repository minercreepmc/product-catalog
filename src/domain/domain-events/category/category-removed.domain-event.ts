import {
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { DomainEvent } from 'common-base-classes';

export interface CategoryRemovedDomainEventDetails {
  subIds: SubCategoryIdValueObject[];
  parentIds: ParentCategoryIdValueObject[];
}

export interface CategoryRemovedDomainEventOptions {
  id: CategoryIdValueObject;
  details: CategoryRemovedDomainEventDetails;
}

export class CategoryRemovedDomainEvent extends DomainEvent<CategoryRemovedDomainEventDetails> {
  constructor(options: CategoryRemovedDomainEventOptions) {
    const { id, details } = options;
    super({
      eventName: CategoryRemovedDomainEvent.name,
      entityType: CategoryRemovedDomainEvent.name,
      eventDetails: details,
      entityId: id,
    });
  }

  get categoryId() {
    return this.entityId;
  }

  get subIds() {
    return this.details.subIds;
  }

  get parentIds() {
    return this.details.parentIds;
  }
}
