import { ICommand } from '@nestjs/cqrs';

export class CreateCategoryCommand implements ICommand {
  name: string;
  description?: string;
  parentIds?: string[];
  subCategoryIds?: string[];
  productIds?: string[];

  constructor(options: CreateCategoryCommand) {
    this.name = options.name;
    this.description = options.description;
    this.parentIds = options.parentIds;
    this.subCategoryIds = options.subCategoryIds;
    this.productIds = options.productIds;
  }
}
