import { CategoryAggregate } from '@aggregates/category';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { DomainEvent } from 'common-base-classes';

export interface SubCategoriesDetachedDetails {
  subIds: SubCategoryIdValueObject[];
}

export interface SubCategoriesDetachedOptions {
  id: CategoryIdValueObject;
  details: SubCategoriesDetachedDetails;
}

export class SubCategoriesDetachedDomainEvent extends DomainEvent<SubCategoriesDetachedDetails> {
  constructor(options: SubCategoriesDetachedOptions) {
    super({
      entityId: options.id,
      eventName: SubCategoriesDetachedDomainEvent.name,
      entityType: CategoryAggregate.name,
      eventDetails: options.details,
    });
  }

  get subIds(): SubCategoryIdValueObject[] {
    return this.details.subIds;
  }

  get categoryId(): CategoryIdValueObject {
    return this.entityId;
  }
}
