import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class DetachSubCategoriesRequestDto extends RequestDtoBase<DetachSubCategoriesRequestDto> {
  categoryId: string;
  subIds: string[];

  constructor(options: Omit<DetachSubCategoriesRequestDto, 'returnType'>) {
    super();
    this.categoryId = options.categoryId;
    this.subIds = options.subIds;
  }
}

export class DetachSubCategoriesResponseDto extends ResponseDtoBase {
  categoryId: string;
  subIds: string[];
  constructor(options: DetachSubCategoriesResponseDto) {
    super();
    this.categoryId = options.categoryId;
    this.subIds = options.subIds;
  }
}
