import { ICommand } from '@nestjs/cqrs';

export class AddParentCategoriesCommand implements ICommand {
  categoryId: string;
  parentIds: string[];

  constructor(options: AddParentCategoriesCommand) {
    this.categoryId = options.categoryId;
    this.parentIds = options.parentIds;
  }
}
