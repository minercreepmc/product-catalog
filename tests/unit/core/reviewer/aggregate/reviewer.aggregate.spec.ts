import { ReviewerAggregate } from '@reviewer-domain/aggregate';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
} from '@reviewer-domain/value-objects';

describe('ReviewerAggregate', () => {
  it('should create a ReviewerAggregate with a given id', () => {
    const reviewerIdValueObject = new ReviewerIdValueObject();
    const reviewerAggregate = new ReviewerAggregate(reviewerIdValueObject);
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
    const options = {
      name: new ReviewerNameValueObject('John Doe'),
      email: new ReviewerEmailValueObject('john.doe@example.com'),
    };
    reviewerAggregate.createReviewer(options);
    expect(reviewerAggregate.details.name).toEqual(options.name);
    expect(reviewerAggregate.details.email).toEqual(options.email);
  });

  it('should update a reviewer with the provided options', () => {
    const reviewerAggregate = new ReviewerAggregate();
    const initialOptions = {
      name: new ReviewerNameValueObject('John Doe'),
      email: new ReviewerEmailValueObject('john.doe@example.com'),
    };
    const updateOptions = {
      name: new ReviewerNameValueObject('Jane Doe'),
    };
    reviewerAggregate.createReviewer(initialOptions);
    reviewerAggregate.updateReviewer(updateOptions);
    expect(reviewerAggregate.details.name).toEqual(updateOptions.name);
    expect(reviewerAggregate.details.email).toEqual(initialOptions.email);
  });
});
