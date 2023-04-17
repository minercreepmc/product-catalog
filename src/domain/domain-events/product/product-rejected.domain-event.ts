import { ProductAggregate } from '@aggregates/product';
import {
  ProductIdValueObject,
  ProductStatusValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { DomainEvent } from 'common-base-classes';

export interface ProductRejectedDomainEventDetails {
  rejectedBy: ReviewerIdValueObject;
  productStatus: ProductStatusValueObject;
  reason: RejectionReasonValueObject;
}

export interface ProductRejectedDomainEventOptions {
  productId: ProductIdValueObject;
  details: ProductRejectedDomainEventDetails;
}

export class ProductRejectedDomainEvent extends DomainEvent<ProductRejectedDomainEventDetails> {
  constructor(options: ProductRejectedDomainEventOptions) {
    const { productId, details } = options;

    super({
      entityId: productId,
      eventName: ProductRejectedDomainEvent.name,
      entityType: ProductAggregate.name,
      eventDetails: details,
    });
  }

  get productId() {
    return this.entityId;
  }

  get reason() {
    return this.details.reason;
  }

  get rejectedBy() {
    return this.details.rejectedBy;
  }
}
