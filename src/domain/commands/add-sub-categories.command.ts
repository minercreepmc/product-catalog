import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';

export class AddSubCategoriesCommand {
  categoryId: CategoryIdValueObject;
  subCategoryIds: SubCategoryIdValueObject[];

  constructor(options: AddSubCategoriesCommand) {
    this.categoryId = options.categoryId;
    this.subCategoryIds = options.subCategoryIds;
  }
}
