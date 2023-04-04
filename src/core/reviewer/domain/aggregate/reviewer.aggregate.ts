import { ReviewerCreatedDomainEvent } from '@reviewer-domain/domain-events';
import {
  ReviewerUpdatedDomainEvent,
  ReviewerUpdatedDomainEventDetails,
} from '@reviewer-domain/domain-events/reviewer-updated.domain-event';
import { ReviewerIdValueObject } from '@reviewer-domain/value-objects';
import { OptionalEntityOptions } from '@utils/types';
import { AbstractAggregateRoot } from 'common-base-classes';
import {
  CreateReviewerAggregateOptions,
  ReviewerAggregateDetails,
  UpdateReviewerAggregateOptions,
} from './reviewer.aggregate.interface';

export class ReviewerAggregate extends AbstractAggregateRoot<
  Partial<ReviewerAggregateDetails>
> {
  constructor(options: OptionalEntityOptions<ReviewerAggregateDetails> = {}) {
    const defaultId = new ReviewerIdValueObject();
    const defaultDetails = {};
    const { id = defaultId, details = defaultDetails } = options ?? {};

    super({ id, details });
  }

  createReviewer(
    options: CreateReviewerAggregateOptions,
  ): ReviewerCreatedDomainEvent {
    this.details.name = options.name;
    this.details.email = options.email;
    return new ReviewerCreatedDomainEvent({
      reviewerId: this.id,
      details: {
        name: this.details.name,
        email: this.details.email,
      },
    });
  }

  updateReviewer(
    options: UpdateReviewerAggregateOptions,
  ): ReviewerUpdatedDomainEvent {
    const { name } = options;

    const eventDetails: ReviewerUpdatedDomainEventDetails = {};

    if (name) {
      this.details.name = name;
      eventDetails.name = name;
    }

    return new ReviewerUpdatedDomainEvent({
      reviewerId: this.id,
      details: eventDetails,
    });
  }
}
