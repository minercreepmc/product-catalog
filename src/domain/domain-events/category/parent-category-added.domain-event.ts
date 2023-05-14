import { CategoryAggregate } from '@aggregates/category';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { DomainEvent } from 'common-base-classes';

export interface ParentCategoryCreatedDetails {
  parentIds: SubCategoryIdValueObject[];
}

export interface ParentCategoryCreatedOptions {
  id?: CategoryIdValueObject;
  details?: ParentCategoryCreatedDetails;
}

export class ParentCategoryAddedDomainEvent extends DomainEvent<ParentCategoryCreatedDetails> {
  constructor(options: ParentCategoryCreatedOptions) {
    const { id, details } = options;

    super({
      entityId: id,
      eventName: ParentCategoryAddedDomainEvent.name,
      eventDetails: details,
      entityType: CategoryAggregate.name,
    });
  }

  get categoryId(): CategoryIdValueObject {
    return this.entityId;
  }

  get parentIds(): SubCategoryIdValueObject[] {
    return this.details.parentIds;
  }
}
