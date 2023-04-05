import { AbstractValueObject } from 'common-base-classes';
import { CategoryIdValueObject } from './category-id.value-object';

export interface CategoryPathValueObjectDetails {
  categoryIds: CategoryIdValueObject[];
}

export class CategoryPathValueObject extends AbstractValueObject<CategoryPathValueObjectDetails> {
  constructor(options: CategoryPathValueObjectDetails) {
    if (!CategoryPathValueObject.isValidOptions(options)) {
      throw new Error('Invalid categoryIds provided');
    }
    super(options);
  }

  static isValidOptions(options: CategoryPathValueObjectDetails): boolean {
    return options.categoryIds.every((categoryId) =>
      CategoryIdValueObject.isValid(categoryId),
    );
  }

  get categoryIds() {
    return this.details.categoryIds;
  }
}
