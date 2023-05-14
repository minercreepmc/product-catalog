import { CategoryAggregate } from '@aggregates/category';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { DomainEvent } from 'common-base-classes';

export interface SubCategoryCreatedDetails {
  subCategoryIds: SubCategoryIdValueObject[];
}

export interface SubCategoryCreatedOptions {
  id?: CategoryIdValueObject;
  details?: SubCategoryCreatedDetails;
}

export class SubCategoryAddedDomainEvent extends DomainEvent<SubCategoryCreatedDetails> {
  constructor(options: SubCategoryCreatedOptions) {
    const { id, details } = options;

    super({
      entityId: id,
      eventName: SubCategoryAddedDomainEvent.name,
      eventDetails: details,
      entityType: CategoryAggregate.name,
    });
  }

  get categoryId(): CategoryIdValueObject {
    return this.entityId;
  }

  get subCategoryIds(): SubCategoryIdValueObject[] {
    return this.details.subCategoryIds;
  }
}
