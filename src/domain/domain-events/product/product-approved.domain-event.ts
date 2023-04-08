import { ProductAggregate } from '@aggregates/product';
import {
  ProductIdValueObject,
  ProductStatusValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { DomainEvent } from 'common-base-classes';

export interface ProductApprovedDomainEventDetails {
  reviewerId: ReviewerIdValueObject;
  status: ProductStatusValueObject;
}

export interface ProductApprovedDomainEventOptions {
  productId: ProductIdValueObject;
  details: ProductApprovedDomainEventDetails;
}

export class ProductApprovedDomainEvent extends DomainEvent<ProductApprovedDomainEventDetails> {
  constructor(options: ProductApprovedDomainEventOptions) {
    const { details, productId } = options;
    super({
      entityId: productId,
      eventName: ProductApprovedDomainEvent.name,
      entityType: ProductAggregate.name,
      eventDetails: details,
    });
  }

  get productId(): ProductIdValueObject {
    return this.entityId;
  }

  get reviewerId(): ReviewerIdValueObject {
    return this.details.reviewerId;
  }

  get status(): ProductStatusValueObject {
    return this.details.status;
  }
}
