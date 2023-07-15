import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';

export class AddSubCategoriesCommand {
  categoryId: CategoryIdValueObject;
  subIds: SubCategoryIdValueObject[];

  constructor(options: AddSubCategoriesCommand) {
    this.categoryId = options.categoryId;
    this.subIds = options.subIds;
  }
}
