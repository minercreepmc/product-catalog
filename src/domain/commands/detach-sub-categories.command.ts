import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';

export class DetachSubCategoriesCommand {
  categoryId: CategoryIdValueObject;
  subIds: SubCategoryIdValueObject[];

  constructor(optiosn: DetachSubCategoriesCommand) {
    this.categoryId = optiosn.categoryId;
    this.subIds = optiosn.subIds;
  }
}
