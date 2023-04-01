import { ProductUpdatedDomainEvent } from '@product-domain/domain-events';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import { UpdateProductMapper } from '@product-use-case/update-product/application-services';
import { UpdateProductCommand } from '@product-use-case/update-product/dtos';
import { ID } from 'common-base-classes';

describe('UpdateProductMapper', () => {
  const updateProductMapper = new UpdateProductMapper();

  describe('toDomain', () => {
    it('should return UpdateProductDomainOptions object', () => {
      const updateProductCommand = new UpdateProductCommand({
        productId: '12345',
        name: 'Test Product Name',
        price: {
          amount: 10.99,
          currency: 'USD',
        },
      });
      const result = updateProductMapper.toDomain(updateProductCommand);

      expect(result.payload.name.unpack()).toBe(updateProductCommand.name);
      expect(result.payload.price.unpack().amount).toBe(
        updateProductCommand.price.amount,
      );
      expect(result.payload.price.unpack().currency).toBe(
        updateProductCommand.price.currency,
      );
    });
  });

  describe('toResponseDto', () => {
    it('should return UpdateProductResponseDto object', () => {
      const productUpdatedDomainEvent = new ProductUpdatedDomainEvent({
        productId: new ID('12345'),
        details: {
          name: new ProductNameValueObject('Test Product Name'),
          price: ProductPriceValueObject.create({
            amount: 10.99,
            currency: 'USD',
          }),
        },
      });
      const result = updateProductMapper.toResponseDto(
        productUpdatedDomainEvent,
      );

      expect(result.name).toBe(productUpdatedDomainEvent.details.name.unpack());
      expect(result.price.amount).toBe(
        productUpdatedDomainEvent.details.price.unpack().amount,
      );
      expect(result.price.currency).toBe(
        productUpdatedDomainEvent.details.price.unpack().currency,
      );
    });
  });
});
