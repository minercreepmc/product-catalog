import { ProductAggregate } from '@aggregates/product';
import {
  ProductSubmittedDomainEvent,
  ProductSubmittedDomainEventDetails,
  ProductSubmittedDomainEventOptions,
} from '@domain-events/product';
import {
  ProductIdValueObject,
  ProductStatusValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

describe('ProductSubmittedDomainEvent', () => {
  it('should create a domain event with the correct entity ID, event name, entity type, and event details', () => {
    // Set up test data
    const productId = new ProductIdValueObject('123');
    const reviewerId = new ReviewerIdValueObject('456');
    const productStatus = new ProductStatusValueObject('approved');
    const details: ProductSubmittedDomainEventDetails = {
      reviewerId,
      productStatus,
    };
    const options: ProductSubmittedDomainEventOptions = {
      productId,
      details,
    };

    // Execute the method
    const event = new ProductSubmittedDomainEvent(options);

    // Check the result
    expect(event.entityId).toEqual(productId);
    expect(event.eventName).toEqual(ProductSubmittedDomainEvent.name);
    expect(event.entityType).toEqual(ProductAggregate.name);
    expect(event.details).toEqual(details);
  });

  it('should return the correct product ID when calling getProductId', () => {
    // Set up test data
    const productId = new ProductIdValueObject('123');
    const reviewerId = new ReviewerIdValueObject('456');
    const productStatus = ProductStatusValueObject.createPending();
    const details: ProductSubmittedDomainEventDetails = {
      reviewerId,
      productStatus,
    };
    const options: ProductSubmittedDomainEventOptions = {
      productId,
      details,
    };
    const event = new ProductSubmittedDomainEvent(options);

    // Execute the method
    const result = event.productId;

    // Check the result
    expect(result).toEqual(productId);
  });
});
