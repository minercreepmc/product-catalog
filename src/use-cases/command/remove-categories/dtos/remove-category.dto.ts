import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class RemoveCategoriesRequestDto extends RequestDtoBase<RemoveCategoriesResponseDto> {
  readonly ids: string[];

  constructor(options: any) {
    super();
    this.ids = options.ids;
  }
}

export class RemoveCategoriesResponseDto extends ResponseDtoBase {
  readonly ids: string[];

  constructor(options: RemoveCategoriesResponseDto) {
    super();
    this.ids = options.ids;
  }
}
