import { ReviewerIdValueObject } from '@reviewer-domain/value-objects';
import { AbstractAggregateRoot } from 'common-base-classes';
import {
  CreateReviewerAggregateOptions,
  ReviewerAggregateDetails,
  UpdateReviewerAggregateOptions,
} from './reviewer.aggregate.interface';

export class ReviewerAggregate extends AbstractAggregateRoot<
  Partial<ReviewerAggregateDetails>
> {
  constructor(id?: ReviewerIdValueObject) {
    const details: Partial<ReviewerAggregateDetails> = {};
    const reviewerId = id ? id : new ReviewerIdValueObject();
    super({ id: reviewerId, details });
  }

  createReviewer(options: CreateReviewerAggregateOptions): void {
    this.details.name = options.name;
    this.details.email = options.email;
  }

  updateReviewer(options: UpdateReviewerAggregateOptions): void {
    this.details.name = options.name;
  }
}
