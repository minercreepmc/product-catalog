import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class DetachParentCategoriesRequestDto extends RequestDtoBase<DetachParentCategoriesResponseDto> {
  parentIds: string[];
  categoryId: string;
  constructor(options: Omit<DetachParentCategoriesRequestDto, 'returnType'>) {
    super();
    this.parentIds = options.parentIds;
    this.categoryId = options.categoryId;
  }
}

export class DetachParentCategoriesResponseDto extends ResponseDtoBase {
  categoryId: string;
  parentIds: string[];
  constructor(options: DetachParentCategoriesResponseDto) {
    super();
    this.categoryId = options.categoryId;
    this.parentIds = options.parentIds;
  }
}
