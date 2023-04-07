import { ProductAggregate } from '@aggregates/product';
import {
  ProductIdValueObject,
  ProductStatusValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { DomainEvent } from 'common-base-classes';

export interface ProductSubmittedDomainEventDetails {
  reviewerId: ReviewerIdValueObject;
  productStatus: ProductStatusValueObject;
}

export interface ProductSubmittedDomainEventOptions {
  productId: ProductIdValueObject;
  details: ProductSubmittedDomainEventDetails;
}

export class ProductSubmittedDomainEvent extends DomainEvent<ProductSubmittedDomainEventDetails> {
  constructor(options: ProductSubmittedDomainEventOptions) {
    const { productId, details } = options;
    super({
      entityId: productId,
      eventName: ProductSubmittedDomainEvent.name,
      entityType: ProductAggregate.name,
      eventDetails: details,
    });
  }

  get productId(): ProductIdValueObject {
    return this.entityId;
  }
}
