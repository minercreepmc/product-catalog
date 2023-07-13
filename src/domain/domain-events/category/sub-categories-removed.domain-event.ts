import { CategoryAggregate } from '@aggregates/category';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { DomainEvent } from 'common-base-classes';

export interface SubCategoriesRemovedDetails {
  subCategoryIds: SubCategoryIdValueObject[];
}

export interface SubCategoriesRemovedOptions {
  id: CategoryIdValueObject;
  details: SubCategoriesRemovedDetails;
}

export class SubCategoriesRemovedDomainEvent extends DomainEvent<SubCategoriesRemovedDetails> {
  constructor(options: SubCategoriesRemovedOptions) {
    super({
      entityId: options.id,
      eventName: SubCategoriesRemovedDomainEvent.name,
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
