import { ProductAggregate } from '@aggregates/product';
import { DomainEventBase } from '@base/domain';
import { CategoryIdValueObject } from '@value-objects/category';
import { DiscountIdValueObject } from '@value-objects/discount';
import type {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductImageUrlValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
  ProductSoldValueObject,
} from '@value-objects/product';

export interface ProductUpdatedDomainEventDetails {
  readonly id: ProductIdValueObject;
  readonly name?: ProductNameValueObject;
  readonly price?: ProductPriceValueObject;
  readonly description?: ProductDescriptionValueObject;
  readonly image?: ProductImageUrlValueObject;
  readonly sold?: ProductSoldValueObject;
  readonly discountId?: DiscountIdValueObject;
  readonly categoryIds?: CategoryIdValueObject[];
}

export class ProductUpdatedDomainEvent
  extends DomainEventBase
  implements ProductUpdatedDomainEventDetails
{
  constructor(options: ProductUpdatedDomainEventDetails) {
    super({
      eventName: ProductUpdatedDomainEvent.name,
      entityType: ProductAggregate.name,
    });
    this.id = options.id;
    this.name = options.name;
    this.price = options.price;
    this.description = options.description;
    this.image = options.image;
    this.discountId = options.discountId;
    this.categoryIds = options.categoryIds;
  }
  readonly id: ProductIdValueObject;
  readonly name?: ProductNameValueObject;
  readonly price?: ProductPriceValueObject;
  readonly description?: ProductDescriptionValueObject;
  readonly image?: ProductImageUrlValueObject;
  readonly sold?: ProductSoldValueObject;
  readonly discountId?: DiscountIdValueObject;
  readonly categoryIds?: CategoryIdValueObject[];
}
