import { ProductAggregate } from '@aggregates/product';
import { DomainEventBase } from '@base/domain';
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
  }
  readonly id: ProductIdValueObject;
  readonly name?: ProductNameValueObject;
  readonly price?: ProductPriceValueObject;
  readonly description?: ProductDescriptionValueObject;
  readonly image?: ProductImageUrlValueObject;
}
