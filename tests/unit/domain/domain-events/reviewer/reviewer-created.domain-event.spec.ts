import { ReviewerAggregate } from '@aggregates/reviewer';
import {
  ReviewerCreatedDomainEvent,
  ReviewerCreatedDomainEventOptions,
} from '@domain-events/reviewer';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';

describe('ReviewerCreatedDomainEvent', () => {
  const reviewerId = new ReviewerIdValueObject('123');
  const details = {
    name: new ReviewerNameValueObject('John Doe'),
    email: new ReviewerEmailValueObject('john.doe@example.com'),
  };
  const options: ReviewerCreatedDomainEventOptions = { reviewerId, details };

  it('should create a new ReviewerCreatedDomainEvent instance', () => {
    const event = new ReviewerCreatedDomainEvent(options);

    expect(event).toBeInstanceOf(ReviewerCreatedDomainEvent);
    expect(event.entityId).toBe(reviewerId);
    expect(event.entityType).toBe(ReviewerAggregate.name);
    expect(event.eventName).toBe(ReviewerCreatedDomainEvent.name);
    expect(event.details).toBe(details);
  });

  it('should return the correct ReviewerIdValueObject', () => {
    const event = new ReviewerCreatedDomainEvent(options);

    expect(event.reviewerId).toBe(reviewerId);
  });
});
