import { FileValueObject } from '@value-objects/file.value-object';
import {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { ValidateNested } from 'class-validator';

export class UpdateProductCommand {
  @ValidateNested()
  id: ProductIdValueObject;
  @ValidateNested()
  name?: ProductNameValueObject;
  @ValidateNested()
  price?: ProductPriceValueObject;
  @ValidateNested()
  description?: ProductDescriptionValueObject;
  @ValidateNested()
  image?: FileValueObject;

  constructor(options: UpdateProductCommand) {
    this.id = options.id;
    this.name = options.name;
    this.price = options.price;
    this.description = options.description;
    this.image = options.image;
  }
}

export class UpdateProductResponseDto {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;

  constructor(dto: UpdateProductResponseDto) {
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
    if (dto.imageUrl) {
      this.imageUrl = dto.imageUrl;
    }
  }
}
