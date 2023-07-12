import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class AddSubCategoriesRequestDto extends RequestDtoBase<AddSubCategoriesResponseDto> {
  categoryId: string;
  subCategoryIds: string[];

  constructor(options: Omit<AddSubCategoriesRequestDto, 'returnType'>) {
    super();
    this.categoryId = options.categoryId;
    this.subCategoryIds = options.subCategoryIds;
  }
}

export class AddSubCategoriesResponseDto extends ResponseDtoBase {
  categoryId: string;
  subCategoryIds: string[];
  parentIds?: string[];

  constructor(options: Omit<AddSubCategoriesResponseDto, 'message'>) {
    super('Sub categories added successfully');
    this.categoryId = options.categoryId;
    this.subCategoryIds = options.subCategoryIds;
    this.parentIds = options.parentIds;
  }
}
