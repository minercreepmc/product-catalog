import { FileValueObject } from '@value-objects/common';
import {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

export class UpdateProductCommand {
  productId: ProductIdValueObject;
  name?: ProductNameValueObject;
  price?: ProductPriceValueObject;
  description?: ProductDescriptionValueObject;
  image?: FileValueObject;

  constructor(options: UpdateProductCommand) {
    this.productId = options.productId;
    this.name = options.name;
    this.price = options.price;
    this.description = options.description;
    this.image = options.image;
  }
}
