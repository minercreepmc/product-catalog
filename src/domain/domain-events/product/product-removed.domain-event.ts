import { ProductAggregate } from '@aggregates/product';
import { ProductIdValueObject } from '@value-objects/product';
import { DomainEvent } from 'common-base-classes';

export interface ProductRemovedDomainEventOptions {
  productId: ProductIdValueObject;
}

export class ProductRemovedDomainEvent extends DomainEvent<ProductRemovedDomainEventOptions> {
  constructor(options: ProductRemovedDomainEventOptions) {
    super({
      eventName: ProductRemovedDomainEvent.name,
      entityType: ProductAggregate.name,
      eventDetails: options,
      entityId: options.productId,
    });
  }

  get productId() {
    return this.entityId;
  }
}
