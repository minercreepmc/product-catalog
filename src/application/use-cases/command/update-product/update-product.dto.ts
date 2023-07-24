import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases/command-handler/command.base';
import { DiscountIdValueObject } from '@value-objects/discount';
import { FileValueObject } from '@value-objects/file.value-object';
import {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

export class UpdateProductCommand implements CommandBase {
  id: ProductIdValueObject;
  name?: ProductNameValueObject;
  price?: ProductPriceValueObject;
  description?: ProductDescriptionValueObject;
  image?: FileValueObject;
  discountId?: DiscountIdValueObject;

  validate?(): DomainExceptionBase[] {
    return [
      this.id.validate(),
      this.name?.validate?.(),
      this.price?.validate?.(),
      this.description?.validate?.(),
      this.image?.validate?.(),
      this.discountId?.validate?.(),
    ].filter((e) => e);
  }

  constructor(options: UpdateProductCommand) {
    this.id = options.id;
    this.name = options.name;
    this.price = options.price;
    this.description = options.description;
    this.image = options.image;
    this.discountId = options.discountId;
  }
}

export class UpdateProductResponseDto {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  discountId?: string;

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
    if (dto.discountId) {
      this.discountId = dto.discountId;
    }
  }
}
