import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class RemoveProductsRequestDto extends RequestDtoBase<ResponseDtoBase> {
  readonly ids: string[];
  constructor(options: any) {
    super();
    this.ids = options.ids;
  }
}

export class RemoveProductsResponseDto extends ResponseDtoBase {
  ids: string[];

  constructor(options: RemoveProductsResponseDto) {
    super();
    this.ids = options.ids;
  }
}
