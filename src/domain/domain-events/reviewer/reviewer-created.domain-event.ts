import { ReviewerAggregate } from '@aggregates/reviewer';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';
import { DomainEvent } from 'common-base-classes';

export interface ReviewerCreatedDomainEventOptions {
  reviewerId: ReviewerIdValueObject;
  details: ReviewerCreatedDomainEventDetails;
}

export interface ReviewerCreatedDomainEventDetails {
  name: ReviewerNameValueObject;
  email: ReviewerEmailValueObject;
}

export class ReviewerCreatedDomainEvent extends DomainEvent<ReviewerCreatedDomainEventDetails> {
  constructor(options: ReviewerCreatedDomainEventOptions) {
    const { reviewerId, details } = options;
    super({
      entityId: reviewerId,
      entityType: ReviewerAggregate.name,
      eventName: ReviewerCreatedDomainEvent.name,
      eventDetails: details,
    });
  }

  get reviewerId(): ReviewerIdValueObject {
    return this.entityId;
  }
}
