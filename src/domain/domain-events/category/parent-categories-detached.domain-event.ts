import { CategoryAggregate } from '@aggregates/category';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { DomainEvent } from 'common-base-classes';

export interface ParentCategoriesDetachedDetails {
  parentIds: SubCategoryIdValueObject[];
}

export interface ParentCategoriesDetachedOptions {
  id: CategoryIdValueObject;
  details: ParentCategoriesDetachedDetails;
}

export class ParentCategoriesDetachedDomainEvent extends DomainEvent<ParentCategoriesDetachedDetails> {
  constructor(options: ParentCategoriesDetachedOptions) {
    super({
      entityId: options.id,
      eventName: ParentCategoriesDetachedDomainEvent.name,
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
