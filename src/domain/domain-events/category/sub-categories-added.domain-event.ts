import { CategoryAggregate } from '@aggregates/category';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { DomainEvent } from 'common-base-classes';

export interface SubCategoryAddedDetails {
  subIds: SubCategoryIdValueObject[];
}

export interface SubCategoryAddedOptions {
  id?: CategoryIdValueObject;
  details?: SubCategoryAddedDetails;
}

export class SubCategoriesAddedDomainEvent extends DomainEvent<SubCategoryAddedDetails> {
  constructor(options: SubCategoryAddedOptions) {
    const { id, details } = options;

    super({
      entityId: id,
      eventName: SubCategoriesAddedDomainEvent.name,
      eventDetails: details,
      entityType: CategoryAggregate.name,
    });
  }

  get categoryId(): CategoryIdValueObject {
    return this.entityId;
  }

  get subIds(): SubCategoryIdValueObject[] {
    return this.details.subIds;
  }
}
