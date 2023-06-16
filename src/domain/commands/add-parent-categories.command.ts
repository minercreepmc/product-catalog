import {
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
} from '@value-objects/category';

export class AddParentCategoriesCommand {
  categoryId: CategoryIdValueObject;
  parentIds: ParentCategoryIdValueObject[];

  constructor(options: AddParentCategoriesCommand) {
    this.categoryId = options.categoryId;
    this.parentIds = options.parentIds;
  }
}
