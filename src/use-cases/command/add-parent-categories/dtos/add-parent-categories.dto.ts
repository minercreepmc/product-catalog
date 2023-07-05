import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class AddParentCategoriesRequestDto extends RequestDtoBase<AddParentCategoriesResponseDto> {
  categoryId: string;
  parentIds: string[];

  constructor(options: Omit<AddParentCategoriesRequestDto, 'returnType'>) {
    super();
    this.categoryId = options.categoryId;
    this.parentIds = options.parentIds;
  }
}

export class AddParentCategoriesResponseDto extends ResponseDtoBase {
  parentIds: string[];
  categoryId: string;

  constructor(options: Omit<AddParentCategoriesResponseDto, 'message'>) {
    super('Parent categories added successfully');
    this.parentIds = options.parentIds;
    this.categoryId = options.categoryId;
  }
}
