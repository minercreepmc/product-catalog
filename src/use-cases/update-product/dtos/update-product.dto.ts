import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class UpdateProductPriceRequestDto {
  amount: number;
  currency: string;
}

export class UpdateProductRequestDto extends RequestDtoBase<UpdateProductResponseDto> {
  id: string;
  name?: string;
  price?: UpdateProductPriceRequestDto;
  description?: string;
  image?: string;

  constructor(options: Omit<UpdateProductRequestDto, 'returnType'>) {
    super();
    this.id = options.id;
    this.name = options.name;
    this.price = options.price;
    this.description = options.description;
    this.image = options.image;
  }
}

export class UpdateProductResponseDto extends ResponseDtoBase {
  id: string;
  name?: string;
  price?: {
    amount: number;
    currency: string;
  };
  description?: string;
  image?: string;

  constructor(dto: Omit<UpdateProductResponseDto, 'message'>) {
    super('Product updated successfully');
    this.id = dto.id;
    if (dto.name) {
      this.name = dto.name;
    }
    if (dto.price) {
      this.price = dto.price;
    }
    if (dto.description) {
      this.description = dto.description;
    }
    if (dto.image) {
      this.image = dto.image;
    }
  }
}
