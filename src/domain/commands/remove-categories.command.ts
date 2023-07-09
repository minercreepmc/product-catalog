import { CategoryIdValueObject } from '@value-objects/category';

export class RemoveCategoriesCommand {
  readonly ids: CategoryIdValueObject[];
  constructor(options: RemoveCategoriesCommand) {
    this.ids = options.ids;
  }
}
