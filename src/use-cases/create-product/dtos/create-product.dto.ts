import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

class CreateProductPriceRequestDto {
  amount: number;
  currency: string;
}

export class CreateProductRequestDto extends RequestDtoBase<CreateProductResponseDto> {
  name: string;
  price: CreateProductPriceRequestDto;
  description?: string;
  image?: string;

  constructor(dto: Omit<CreateProductRequestDto, 'returnType'>) {
    super();
    this.name = dto.name;
    this.price = dto.price;
    this.description = dto.description;
    this.image = dto.image;
  }
}

export class CreateProductResponseDto extends ResponseDtoBase {
  readonly productId: string;
  readonly name: string;
  readonly price: {
    amount: number;
    currency: string;
  };
  readonly image?: string;
  readonly description?: string;
  constructor(options: Omit<CreateProductResponseDto, 'message'>) {
    super('Product created successfully');
    this.productId = options.productId;
    this.name = options.name;
    this.price = options.price;
    this.image = options.image;
    this.description = options.description;
  }
}
