import { DomainExceptionBase } from '@base/domain';
import { CategoryIdValueObject } from '@value-objects/category';
import { DiscountIdValueObject } from '@value-objects/discount';
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
  discountId?: DiscountIdValueObject;

  validate?(): DomainExceptionBase[] {
    return [
      this.name.validate(),
      this.price.validate(),
      this.description?.validate?.(),
      this.image?.validate?.(),
      this.categoryIds?.map?.((id) => id?.validate?.())[0],
      this.discountId?.validate?.(),
    ].filter((e) => e) as DomainExceptionBase[];
  }

  constructor(dto: CreateProductCommand) {
    this.name = dto.name;
    this.price = dto.price;
    this.description = dto.description;
    this.image = dto.image;
    this.categoryIds = dto.categoryIds;
    this.discountId = dto.discountId;
  }
}
export class CreateProductResponseDto {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly imageUrl?: string;
  readonly description?: string;
  readonly categoryIds?: string[];
  readonly discountId?: string;

  constructor(options: CreateProductResponseDto) {
    this.id = options.id;
    this.name = options.name;
    this.price = options.price;
    this.imageUrl = options.imageUrl;
    this.description = options.description;
    this.discountId = options.discountId;
    this.categoryIds = options.categoryIds;
  }
}
