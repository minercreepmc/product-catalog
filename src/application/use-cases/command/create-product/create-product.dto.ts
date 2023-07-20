import type { FileValueObject } from '@value-objects/file.value-object';
import type {
  ProductDescriptionValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { ValidateNested } from 'class-validator';

export class CreateProductCommand {
  @ValidateNested()
  name: ProductNameValueObject;
  @ValidateNested()
  price: ProductPriceValueObject;
  @ValidateNested()
  description?: ProductDescriptionValueObject;
  @ValidateNested()
  image?: FileValueObject;
  constructor(dto: CreateProductCommand) {
    this.name = dto.name;
    this.price = dto.price;
    this.description = dto.description;
    this.image = dto.image;
  }
}
export class CreateProductResponseDto {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly imageUrl?: string;
  readonly description?: string;
  constructor(options: CreateProductResponseDto) {
    this.id = options.id;
    this.name = options.name;
    this.price = options.price;
    this.imageUrl = options.imageUrl;
    this.description = options.description;
  }
}
