import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';

export interface CategoryAggregateDetails {
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
  parentIds?: ParentCategoryIdValueObject[];
  subCategoryIds?: SubCategoryIdValueObject[];
  productIds?: ProductIdValueObject[];
}

export interface CategoryAggregateOptions {
  id?: CategoryIdValueObject;
  details?: Partial<CategoryAggregateDetails>;
}

export interface CreateCategoryAggregateOptions {
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
  parentIds?: ParentCategoryIdValueObject[];
  subCategoryIds?: SubCategoryIdValueObject[];
  productIds?: ProductIdValueObject[];
}
