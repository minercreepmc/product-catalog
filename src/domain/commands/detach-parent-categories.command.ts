import {
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
} from '@value-objects/category';

export class DetachParentCategoriesCommand {
  parentIds: ParentCategoryIdValueObject[];
  categoryId: CategoryIdValueObject;

  constructor(optiosn: DetachParentCategoriesCommand) {
    this.parentIds = optiosn.parentIds;
    this.categoryId = optiosn.categoryId;
  }
}
