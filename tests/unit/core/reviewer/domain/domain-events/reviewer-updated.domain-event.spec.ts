import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@product-domain/value-objects';
import { ReviewerAggregate } from '@reviewer-domain/aggregate';
import {
  ReviewerUpdatedDomainEvent,
  ReviewerUpdatedDomainEventOptions,
} from '@reviewer-domain/domain-events/reviewer-updated.domain-event';

describe('ReviewerUpdatedDomainEvent', () => {
  const reviewerId = new ProductIdValueObject('123');
  const details = { name: new ProductNameValueObject('New Product Name') };
  const options: ReviewerUpdatedDomainEventOptions = { reviewerId, details };

  it('should create a new ReviewerUpdatedDomainEvent instance', () => {
    const event = new ReviewerUpdatedDomainEvent(options);

    expect(event).toBeInstanceOf(ReviewerUpdatedDomainEvent);
    expect(event.entityId).toBe(reviewerId);
    expect(event.entityType).toBe(ReviewerAggregate.name);
    expect(event.eventName).toBe(ReviewerUpdatedDomainEvent.name);
    expect(event.details).toBe(details);
  });

  it('should return the correct ProductIdValueObject', () => {
    const event = new ReviewerUpdatedDomainEvent(options);

    expect(event.reviewerId).toBe(reviewerId);
  });
});
