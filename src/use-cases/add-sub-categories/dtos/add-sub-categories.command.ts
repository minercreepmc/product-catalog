import { ICommand } from '@nestjs/cqrs';

export class AddSubCategoriesCommand implements ICommand {
  categoryId: string;
  subCategoryIds: string[];

  constructor(options: AddSubCategoriesCommand) {
    this.categoryId = options.categoryId;
    this.subCategoryIds = options.subCategoryIds;
  }
}
