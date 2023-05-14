export class AddSubCategoriesResponseDto {
  categoryId: string;
  subCategoryIds: string[];

  constructor(options: AddSubCategoriesResponseDto) {
    this.categoryId = options.categoryId;
    this.subCategoryIds = options.subCategoryIds;
  }
}
