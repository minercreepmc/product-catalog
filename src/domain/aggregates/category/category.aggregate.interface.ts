import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import { EntityOptions } from 'common-base-classes';

export interface CategoryAggregateDetails {
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
  parentIds?: ParentCategoryIdValueObject[];
  subCategoryIds?: SubCategoryIdValueObject[];
  productIds?: ProductIdValueObject[];
}

export interface CategoryAggregateOptions {
  id?: CategoryIdValueObject;
  details?: OptionalEntityOptions<CategoryAggregateDetails>;
}

export interface CreateCategoryAggregateOptions {
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
  parentIds?: ParentCategoryIdValueObject[];
  subCategoryIds?: SubCategoryIdValueObject[];
  productIds?: ProductIdValueObject[];
}

type OptionalEntityOptions<T> = Partial<EntityOptions<T>>;
