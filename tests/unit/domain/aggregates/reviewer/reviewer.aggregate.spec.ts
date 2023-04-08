import {
  CreateReviewerAggregateOptions,
  ReviewerAggregate,
} from '@aggregates/reviewer';
import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { ReviewerUpdatedDomainEvent } from '@domain-events/reviewer/reviewer-updated.domain-event';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';

describe('ReviewerAggregate', () => {
  it('should create a ReviewerAggregate with a given id', () => {
    const reviewerIdValueObject = new ReviewerIdValueObject();
    const reviewerAggregate = new ReviewerAggregate({
      id: reviewerIdValueObject,
    });
    expect(reviewerAggregate).toBeInstanceOf(ReviewerAggregate);
    expect(reviewerAggregate.id).toEqual(reviewerIdValueObject);
  });

  it('should create a ReviewerAggregate with a generated id', () => {
    const reviewerAggregate = new ReviewerAggregate();
    expect(reviewerAggregate).toBeInstanceOf(ReviewerAggregate);
    expect(reviewerAggregate.id).toBeInstanceOf(ReviewerIdValueObject);
  });

  it('should create a reviewer with the provided options', () => {
    const reviewerAggregate = new ReviewerAggregate();
    const options: CreateReviewerAggregateOptions = {
      name: new ReviewerNameValueObject('John Doe'),
      email: new ReviewerEmailValueObject('john.doe@example.com'),
      role: ReviewerRoleValueObject.createAdmin(),
    };
    const reviewerCreated = reviewerAggregate.createReviewer(options);
    expect(reviewerAggregate.details.name).toEqual(options.name);
    expect(reviewerAggregate.details.email).toEqual(options.email);
    expect(reviewerAggregate.details.role).toEqual(options.role);
    expect(reviewerCreated).toBeInstanceOf(ReviewerCreatedDomainEvent);
  });

  it('should update a reviewer with the provided options', () => {
    const reviewerAggregate = new ReviewerAggregate();
    const initialOptions: CreateReviewerAggregateOptions = {
      name: new ReviewerNameValueObject('John Doe'),
      email: new ReviewerEmailValueObject('john.doe@example.com'),
      role: ReviewerRoleValueObject.createAdmin(),
    };
    const updateOptions = {
      name: new ReviewerNameValueObject('Jane Doe'),
    };
    reviewerAggregate.createReviewer(initialOptions);
    const reviewerUpdated = reviewerAggregate.updateReviewer(updateOptions);
    expect(reviewerAggregate.details.name).toEqual(updateOptions.name);
    expect(reviewerAggregate.details.email).toEqual(initialOptions.email);
    expect(reviewerAggregate.details.role).toEqual(initialOptions.role);
    expect(reviewerUpdated).toBeInstanceOf(ReviewerUpdatedDomainEvent);
  });
});
