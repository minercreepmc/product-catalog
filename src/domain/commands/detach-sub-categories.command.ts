import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';

export class DetachSubCategoriesCommand {
  categoryId: CategoryIdValueObject;
  subCategoryIds: SubCategoryIdValueObject[];

  constructor(optiosn: DetachSubCategoriesCommand) {
    this.categoryId = optiosn.categoryId;
    this.subCategoryIds = optiosn.subCategoryIds;
  }
}
