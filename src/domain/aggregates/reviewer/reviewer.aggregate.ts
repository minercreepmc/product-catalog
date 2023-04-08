import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import {
  ReviewerUpdatedDomainEvent,
  ReviewerUpdatedDomainEventDetails,
} from '@domain-events/reviewer/reviewer-updated.domain-event';
import { OptionalEntityOptions } from '@utils/types';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
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

  get name(): ReviewerNameValueObject {
    return this.details.name;
  }

  get email(): ReviewerEmailValueObject {
    return this.details.email;
  }

  get role(): ReviewerRoleValueObject {
    return this.details.role;
  }

  createReviewer(
    options: CreateReviewerAggregateOptions,
  ): ReviewerCreatedDomainEvent {
    this.details.name = options.name;
    this.details.email = options.email;
    this.details.role = options.role;
    return new ReviewerCreatedDomainEvent({
      reviewerId: this.id,
      details: {
        name: this.details.name,
        email: this.details.email,
        role: this.details.role,
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
