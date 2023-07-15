import { CategoryAggregate } from '@aggregates/category';
import {
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
} from '@value-objects/category';
import { DomainEvent } from 'common-base-classes';

export interface ParentCategoriesAddedDetails {
  parentIds: ParentCategoryIdValueObject[];
}

export interface ParentCategoriesAddedOptions {
  id?: CategoryIdValueObject;
  details?: ParentCategoriesAddedDetails;
}

export class ParentCategoriesAddedDomainEvent extends DomainEvent<ParentCategoriesAddedDetails> {
  constructor(options: ParentCategoriesAddedOptions) {
    const { id, details } = options;

    super({
      entityId: id,
      eventName: ParentCategoriesAddedDomainEvent.name,
      eventDetails: details,
      entityType: CategoryAggregate.name,
    });
  }

  get categoryId(): CategoryIdValueObject {
    return this.entityId;
  }

  get parentIds(): ParentCategoryIdValueObject[] {
    return this.details.parentIds;
  }
}
