import { ProductAggregate } from '@product-domain/aggregate';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import { DomainEvent } from 'common-base-classes';
import { ProductCreatedDomainEvent } from './product-created.domain-event';

export interface ProductUpdatedDomainEventDetails {
  name: ProductNameValueObject;
  price: ProductPriceValueObject;
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
}
