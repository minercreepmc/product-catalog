import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@product-domain/value-objects';
import { ReviewerAggregate } from '@reviewer-domain/aggregate';
import { DomainEvent } from 'common-base-classes';

export interface ReviewerUpdatedDomainEventOptions {
  reviewerId: ProductIdValueObject;
  details: ReviewerUpdatedDomainEventDetails;
}

export interface ReviewerUpdatedDomainEventDetails {
  name?: ProductNameValueObject;
}

export class ReviewerUpdatedDomainEvent extends DomainEvent<ReviewerUpdatedDomainEventDetails> {
  constructor(options: ReviewerUpdatedDomainEventOptions) {
    const { details, reviewerId } = options;
    super({
      entityId: reviewerId,
      eventName: ReviewerUpdatedDomainEvent.name,
      entityType: ReviewerAggregate.name,
      eventDetails: details,
    });
  }

  get reviewerId(): ProductIdValueObject {
    return this.entityId;
  }
}
