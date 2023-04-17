import { ProductAggregate } from '@aggregates/product';
import {
  ProductRejectedDomainEvent,
  ProductRejectedDomainEventDetails,
  ProductRejectedDomainEventOptions,
} from '@domain-events/product';
import {
  ProductIdValueObject,
  ProductStatusValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

describe('ProductRejectedDomainEvent', () => {
  it('should create a ProductRejectedDomainEvent with the correct properties', () => {
    const productId = new ProductIdValueObject('123');
    const rejectedBy = new ReviewerIdValueObject('456');
    const reason = new RejectionReasonValueObject('Test reason');
    const productStatus = ProductStatusValueObject.createRejected();

    const details: ProductRejectedDomainEventDetails = {
      rejectedBy,
      productStatus,
      reason,
    };
    const options: ProductRejectedDomainEventOptions = {
      productId,
      details,
    };

    const event = new ProductRejectedDomainEvent(options);

    expect(event.eventName).toEqual(ProductRejectedDomainEvent.name);
    expect(event.entityType).toEqual(ProductAggregate.name);
    expect(event.details).toEqual(details);
    expect(event.entityId).toEqual(productId);
  });
});
