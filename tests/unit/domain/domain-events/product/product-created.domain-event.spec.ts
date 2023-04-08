import { ProductAggregate } from '@aggregates/product';
import {
  ProductCreatedDomainEvent,
  ProductCreatedDomainEventDetails,
  ProductCreatedDomainEventOptions,
} from '@domain-events/product';
import { MoneyCurrencyEnum } from '@value-objects/common/money';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

describe('ProductCreatedDomainEvent', () => {
  it('should create a ProductCreatedDomainEvent with the correct properties', () => {
    const productId = new ProductIdValueObject('123');
    const name = new ProductNameValueObject('Test Product');
    const price = ProductPriceValueObject.create({
      amount: 100,
      currency: MoneyCurrencyEnum.USD,
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
