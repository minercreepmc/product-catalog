import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class AddSubCategoriesRequestDto extends RequestDtoBase<AddSubCategoriesResponseDto> {
  categoryId: string;
  subIds: string[];

  constructor(options: Omit<AddSubCategoriesRequestDto, 'returnType'>) {
    super();
    this.categoryId = options.categoryId;
    this.subIds = options.subIds;
  }
}

export class AddSubCategoriesResponseDto extends ResponseDtoBase {
  categoryId: string;
  subIds: string[];

  constructor(options: Omit<AddSubCategoriesResponseDto, 'message'>) {
    super('Sub categories added successfully');
    this.categoryId = options.categoryId;
    this.subIds = options.subIds;
  }
}
