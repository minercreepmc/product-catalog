import { CreateCategoryCommand } from '@use-cases/create-category/dtos';

export class CreateCategoryHttpRequest implements CreateCategoryCommand {
  name: string;
  description?: string;
  parentIds?: string[];
  subCategoryIds?: string[];
  productIds?: string[];
}
