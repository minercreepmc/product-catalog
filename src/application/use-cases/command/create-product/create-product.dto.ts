import { DomainExceptionBase } from '@base/domain';
import type { FileValueObject } from '@value-objects/file.value-object';
import type {
  ProductDescriptionValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

export class CreateProductCommand {
  name: ProductNameValueObject;
  price: ProductPriceValueObject;
  description?: ProductDescriptionValueObject;
  image?: FileValueObject;

  validate?(): DomainExceptionBase[] {
    return [
      this.name.validate(),
      this.price.validate(),
      this.description?.validate?.(),
      this.image?.validate?.(),
    ].filter((e) => e) as DomainExceptionBase[];
  }

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
