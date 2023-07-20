import { ProductAggregate } from '@aggregates/product';
import { DomainEventBase } from '@base/domain';
import type {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductImageUrlValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

export interface ProductCreatedDomainEventDetails {
  id: ProductIdValueObject;
  name: ProductNameValueObject;
  price: ProductPriceValueObject;
  description?: ProductDescriptionValueObject;
  image?: ProductImageUrlValueObject;
}

export class ProductCreatedDomainEvent
  extends DomainEventBase
  implements ProductCreatedDomainEventDetails
{
  readonly id: ProductIdValueObject;
  readonly name: ProductNameValueObject;
  readonly price: ProductPriceValueObject;
  readonly description?: ProductDescriptionValueObject;
  readonly image?: ProductImageUrlValueObject;
  constructor(options: ProductCreatedDomainEventDetails) {
    super({
      eventName: ProductCreatedDomainEvent.name,
      entityType: ProductAggregate.name,
    });
    this.id = options.id;
    this.name = options.name;
    this.price = options.price;
    this.description = options.description;
    this.image = options.image;
  }
}
