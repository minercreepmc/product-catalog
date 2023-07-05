import { FileValueObject } from '@value-objects/common';
import {
  ProductDescriptionValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

export class CreateProductCommand {
  name: ProductNameValueObject;
  price: ProductPriceValueObject;
  description?: ProductDescriptionValueObject;
  image?: FileValueObject;
  constructor(dto: CreateProductCommand) {
    this.name = dto.name;
    this.price = dto.price;
    this.description = dto.description;
    this.image = dto.image;
  }
}
