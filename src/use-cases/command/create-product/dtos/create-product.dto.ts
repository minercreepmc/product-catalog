import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

class CreateProductPriceRequestDto {
  amount: number;
  currency: string;
}

export class CreateProductRequestDto extends RequestDtoBase<CreateProductResponseDto> {
  name: string;
  price: CreateProductPriceRequestDto;
  description?: string;
  image?: Express.Multer.File;

  constructor(dto: Omit<CreateProductRequestDto, 'returnType'>) {
    super();
    this.name = dto.name;
    this.price = {
      amount: Number(dto?.price?.amount),
      currency: dto?.price?.currency,
    };
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
  readonly imageUrl?: string;
  readonly description?: string;
  constructor(options: Omit<CreateProductResponseDto, 'message'>) {
    super('Product created successfully');
    this.productId = options.productId;
    this.name = options.name;
    this.price = options.price;
    this.imageUrl = options.imageUrl;
    this.description = options.description;
  }
}
