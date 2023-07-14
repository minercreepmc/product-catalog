import { CategoryAggregate } from '@aggregates/category';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { DomainEvent } from 'common-base-classes';

export interface SubCategoriesDetachedDetails {
  subCategoryIds: SubCategoryIdValueObject[];
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

  get subCategoryIds(): SubCategoryIdValueObject[] {
    return this.details.subCategoryIds;
  }

  get categoryId(): CategoryIdValueObject {
    return this.entityId;
  }
}
