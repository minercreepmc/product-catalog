import { ProductAggregate } from '@aggregates/product';
import { ProductApprovedDomainEvent } from '@domain-events/product';
import {
  ProductIdValueObject,
  ProductStatusValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

describe('ProductApprovedDomainEvent', () => {
  const reviewerId = new ReviewerIdValueObject('1');
  const status = new ProductStatusValueObject('approved');
  const productId = new ProductIdValueObject('1');

  const eventDetails = {
    reviewerId,
    productStatus: status,
  };

  it('should create an instance of the domain event', () => {
    const domainEvent = new ProductApprovedDomainEvent({
      productId,
      details: eventDetails,
    });

    expect(domainEvent).toBeInstanceOf(ProductApprovedDomainEvent);
    expect(domainEvent.entityId).toEqual(productId);
    expect(domainEvent.eventName).toEqual(ProductApprovedDomainEvent.name);
    expect(domainEvent.entityType).toEqual(ProductAggregate.name);
    expect(domainEvent.details).toEqual(eventDetails);
  });

  it('should have a productId getter that returns the product ID', () => {
    const domainEvent = new ProductApprovedDomainEvent({
      productId,
      details: eventDetails,
    });

    expect(domainEvent.productId).toEqual(productId);
  });
});
