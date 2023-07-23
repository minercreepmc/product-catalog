import { ProductAggregate } from '@aggregates/product';
import { DomainEventBase } from '@base/domain';
import { DiscountIdValueObject } from '@value-objects/discount';
import type {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductImageUrlValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

export interface ProductUpdatedDomainEventDetails {
  readonly id: ProductIdValueObject;
  readonly name?: ProductNameValueObject;
  readonly price?: ProductPriceValueObject;
  readonly description?: ProductDescriptionValueObject;
  readonly image?: ProductImageUrlValueObject;
  readonly discountId: DiscountIdValueObject;
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
  }
  readonly id: ProductIdValueObject;
  readonly name?: ProductNameValueObject;
  readonly price?: ProductPriceValueObject;
  readonly description?: ProductDescriptionValueObject;
  readonly image?: ProductImageUrlValueObject;
  readonly discountId: DiscountIdValueObject;
}
