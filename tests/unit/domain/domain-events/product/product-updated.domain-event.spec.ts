import { ProductAggregate } from '@aggregates/product';
import {
  ProductUpdatedDomainEvent,
  ProductUpdatedDomainEventDetails,
  ProductUpdatedDomainEventOptions,
} from '@domain-events/product';
import { AllowableCurrencyEnum } from '@value-objects/common/money';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

describe('ProductUpdatedDomainEvent', () => {
  it('should create a ProductUpdatedDomainEvent with the correct properties', () => {
    const productId = new ProductIdValueObject('123');
    const name = new ProductNameValueObject('Updated Product');
    const price = ProductPriceValueObject.create({
      amount: 200,
      currency: AllowableCurrencyEnum.USD,
    });

    const details: ProductUpdatedDomainEventDetails = { name, price };
    const options: ProductUpdatedDomainEventOptions = { productId, details };

    const event = new ProductUpdatedDomainEvent(options);

    expect(event.eventName).toEqual(ProductUpdatedDomainEvent.name);
    expect(event.entityType).toEqual(ProductAggregate.name);
    expect(event.details).toEqual(details);
    expect(event.entityId).toEqual(productId);
  });
});
