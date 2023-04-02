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
        description: 'Test Product Description',
        image: 'https://example.com/image.png',
      });
      const result = updateProductMapper.toDomain(updateProductCommand);

      expect(result.payload.name.unpack()).toBe(updateProductCommand.name);
      expect(result.payload.price.unpack().amount).toBe(
        updateProductCommand.price.amount,
      );
      expect(result.payload.price.unpack().currency).toBe(
        updateProductCommand.price.currency,
      );
      expect(result.payload.description.unpack()).toBe(
        updateProductCommand.description,
      );

      expect(result.payload.image.unpack()).toBe(updateProductCommand.image);
    });

    it('should should update without all properties', () => {
      const updateProductCommand = new UpdateProductCommand({
        productId: '12345',
        name: 'Test Product Name',
        image: 'https://example.com/image.png',
      });
      const result = updateProductMapper.toDomain(updateProductCommand);

      expect(result.payload.name.unpack()).toBe(updateProductCommand.name);
      expect(result.payload.image.unpack()).toBe(updateProductCommand.image);
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
