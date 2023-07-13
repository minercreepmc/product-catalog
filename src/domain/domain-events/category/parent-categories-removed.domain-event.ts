import { CategoryAggregate } from '@aggregates/category';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { DomainEvent } from 'common-base-classes';

export interface ParentCategoriesRemovedDetails {
  parentIds: SubCategoryIdValueObject[];
}

export interface ParentCategoriesRemovedOptions {
  id: CategoryIdValueObject;
  details: ParentCategoriesRemovedDetails;
}

export class ParentCategoriesRemovedDomainEvent extends DomainEvent<ParentCategoriesRemovedDetails> {
  constructor(options: ParentCategoriesRemovedOptions) {
    super({
      entityId: options.id,
      eventName: ParentCategoriesRemovedDomainEvent.name,
      eventDetails: options.details,
      entityType: CategoryAggregate.name,
    });
  }

  get parentIds(): SubCategoryIdValueObject[] {
    return this.details.parentIds;
  }

  get categoryId(): CategoryIdValueObject {
    return this.entityId;
  }
}
