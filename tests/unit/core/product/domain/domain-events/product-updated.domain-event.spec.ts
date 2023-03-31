import { AllowableCurrencyEnum } from '@common-domain/value-objects/money';
import { ProductAggregate } from '@product-domain/aggregate';
import {
  ProductUpdatedDomainEvent,
  ProductUpdatedDomainEventDetails,
  ProductUpdatedDomainEventOptions,
} from '@product-domain/domain-events';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';

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
