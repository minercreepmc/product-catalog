import { AddSubCategoriesResponseDto } from '@use-cases/add-sub-categories/dtos';

export class AddSubCategoriesHttpResponse
  implements AddSubCategoriesResponseDto
{
  categoryId: string;
  subCategoryIds: string[];

  constructor(options: AddSubCategoriesHttpResponse) {
    this.categoryId = options.categoryId;
    this.subCategoryIds = options.subCategoryIds;
  }
}
