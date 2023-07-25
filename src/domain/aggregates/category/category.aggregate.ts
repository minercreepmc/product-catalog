import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
} from '@value-objects/category';
import { CategoryNameValueObject } from '@value-objects/category';
import {
  CategoryAggregateDetails,
  CreateCategoryAggregateOptions,
} from './category.aggregate.interface';
import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { CategoryRemovedDomainEvent } from '@domain-events/category';
import { ProductIdValueObject } from '@value-objects/product';

export class CategoryAggregate implements CategoryAggregateDetails {
  constructor(options?: CategoryAggregateDetails) {
    if (options) {
      this.id = options.id;
      this.name = options.name;
      this.description = options.description;
      this.productIds = options.productIds;
    } else {
      this.id = new CategoryIdValueObject();
    }
  }
  id: CategoryIdValueObject;
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
  productIds: ProductIdValueObject[];

  createCategory(options: CreateCategoryAggregateOptions) {
    const { name, description } = options;
    this.name = name;

    if (description) {
      this.description = description;
    }

    return new CategoryCreatedDomainEvent({
      id: this.id,
      name,
      description,
    });
  }

  removeCategory() {
    return new CategoryRemovedDomainEvent({
      id: this.id,
    });
  }
}
