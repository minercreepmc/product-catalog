import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';

export interface CategoryAggregateDetails {
  id: CategoryIdValueObject;
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
}

export interface CreateCategoryAggregateOptions {
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
}
