import {
  CategoryDescriptionValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';

export class CreateCategoryCommand {
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
  parentIds?: ParentCategoryIdValueObject[];
  subCategoryIds?: SubCategoryIdValueObject[];
  productIds?: ProductIdValueObject[];

  constructor(options: CreateCategoryCommand) {
    this.name = options.name;
    this.description = options.description;
    this.parentIds = options.parentIds;
    this.subCategoryIds = options.subCategoryIds;
    this.productIds = options.productIds;
  }
}
