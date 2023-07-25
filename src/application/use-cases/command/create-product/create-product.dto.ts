import { DomainExceptionBase } from '@base/domain';
import { CategoryIdValueObject } from '@value-objects/category';
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
  categoryIds?: CategoryIdValueObject[];

  validate?(): DomainExceptionBase[] {
    return [
      this.name.validate(),
      this.price.validate(),
      this.description?.validate?.(),
      this.image?.validate?.(),
      this.categoryIds?.map((id) => id.validate())[0],
    ].filter((e) => e);
  }

  constructor(dto: CreateProductCommand) {
    this.name = dto.name;
    this.price = dto.price;
    this.description = dto.description;
    this.image = dto.image;
    this.categoryIds = dto.categoryIds;
  }
}
export class CreateProductResponseDto {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly imageUrl?: string;
  readonly description?: string;
  readonly categoryIds?: string[];

  constructor(options: CreateProductResponseDto) {
    this.id = options.id;
    this.name = options.name;
    this.price = options.price;
    this.imageUrl = options.imageUrl;
    this.description = options.description;
    this.categoryIds = options.categoryIds;
  }
}
