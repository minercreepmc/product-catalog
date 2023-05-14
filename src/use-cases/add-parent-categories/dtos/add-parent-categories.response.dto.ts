export class AddParentCategoriesResponseDto {
  parentIds: string[];
  categoryId: string;

  constructor(options: AddParentCategoriesResponseDto) {
    this.parentIds = options.parentIds;
    this.categoryId = options.categoryId;
  }
}
