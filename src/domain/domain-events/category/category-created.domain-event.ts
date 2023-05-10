import { CategoryAggregate } from '@aggregates/category';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import { DomainEvent } from 'common-base-classes';

export interface CategoryCreatedDetails {
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
  parentIds?: ParentCategoryIdValueObject[];
  subCategoryIds?: SubCategoryIdValueObject[];
  productIds?: ProductIdValueObject[];
}

export interface CategoryCreatedOptions {
  id?: CategoryIdValueObject;
  details?: CategoryCreatedDetails;
}

export class CategoryCreatedDomainEvent extends DomainEvent<CategoryCreatedDetails> {
  constructor(options: CategoryCreatedOptions) {
    const { id, details } = options;

    super({
      entityId: id,
      eventName: CategoryCreatedDomainEvent.name,
      eventDetails: details,
      entityType: CategoryAggregate.name,
    });
  }

  get name(): CategoryNameValueObject {
    return this.details.name;
  }

  get description(): CategoryDescriptionValueObject {
    return this.details.description;
  }

  get parentIds(): ParentCategoryIdValueObject[] {
    return this.details.parentIds;
  }

  get subCategoryIds(): SubCategoryIdValueObject[] {
    return this.details.subCategoryIds;
  }

  get productIds(): ProductIdValueObject[] {
    return this.details.productIds;
  }
}
