import { ProductAggregate } from '@product-domain/aggregate';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import { DomainEvent } from 'common-base-classes';

export interface ProductCreatedDomainEventDetails {
  name: ProductNameValueObject;
  price: ProductPriceValueObject;
}

export interface ProductCreatedDomainEventOptions {
  productId: ProductIdValueObject;
  details: ProductCreatedDomainEventDetails;
}

export class ProductCreatedDomainEvent extends DomainEvent<ProductCreatedDomainEventDetails> {
  constructor(options: ProductCreatedDomainEventOptions) {
    const { productId, details } = options;
    super({
      eventName: ProductCreatedDomainEvent.name,
      entityType: ProductAggregate.name,
      eventDetails: details,
      entityId: productId,
    });
  }
}
