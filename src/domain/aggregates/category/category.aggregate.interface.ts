import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';

export interface CategoryAggregateDetails {
  id: CategoryIdValueObject;
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
  productIds?: ProductIdValueObject[];
}

export interface CreateCategoryAggregateOptions {
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
}

export interface UpdateCategoryAggregateOptions {
  name?: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
  productIds?: ProductIdValueObject[];
}
