import { ProductAggregate } from '@aggregates/product';
import type {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductImageValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { DomainEvent } from 'common-base-classes';

export interface ProductUpdatedDomainEventDetails {
  name: ProductNameValueObject;
  price: ProductPriceValueObject;
  description?: ProductDescriptionValueObject;
  image?: ProductImageValueObject;
}

export interface ProductUpdatedDomainEventOptions {
  productId: ProductIdValueObject;
  details: ProductUpdatedDomainEventDetails;
}

export class ProductUpdatedDomainEvent extends DomainEvent<ProductUpdatedDomainEventDetails> {
  constructor(options: ProductUpdatedDomainEventOptions) {
    const { productId, details } = options;
    super({
      eventName: ProductUpdatedDomainEvent.name,
      entityType: ProductAggregate.name,
      eventDetails: details,
      entityId: productId,
    });
  }

  get productId() {
    return this.entityId;
  }
}
