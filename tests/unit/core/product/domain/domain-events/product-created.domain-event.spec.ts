import { AllowableCurrencyEnum } from '@common-domain/value-objects/money';
import { ProductAggregate } from '@product-domain/aggregate';
import {
  ProductCreatedDomainEvent,
  ProductCreatedDomainEventDetails,
  ProductCreatedDomainEventOptions,
} from '@product-domain/domain-events';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';

describe('ProductCreatedDomainEvent', () => {
  it('should create a ProductCreatedDomainEvent with the correct properties', () => {
    const productId = new ProductIdValueObject('123');
    const name = new ProductNameValueObject('Test Product');
    const price = ProductPriceValueObject.create({
      amount: 100,
      currency: AllowableCurrencyEnum.USD,
    });

    const details: ProductCreatedDomainEventDetails = { name, price };
    const options: ProductCreatedDomainEventOptions = { productId, details };

    const event = new ProductCreatedDomainEvent(options);

    expect(event.eventName).toEqual(ProductCreatedDomainEvent.name);
    expect(event.entityType).toEqual(ProductAggregate.name);
    expect(event.details).toEqual(details);
    expect(event.entityId).toEqual(productId);
  });
});
