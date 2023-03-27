import { ProductCreatedDomainEvent } from '@product-domain/domain-events';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import { CreateProductMapper } from '@product-use-case/create-product/application-services';
import {
  CreateProductCommand,
  CreateProductDomainOptions,
  CreateProductResponseDto,
} from '@product-use-case/create-product/dtos';
import { ID } from 'common-base-classes';

describe('CreateProductMapper', () => {
  let mapper: CreateProductMapper;

  beforeEach(() => {
    mapper = new CreateProductMapper();
  });

  describe('toDomain', () => {
    it('should map CreateProductCommand to CreateProductDomainOptions', () => {
      const command = new CreateProductCommand({
        name: 'Valid Name',
        price: { amount: 100, currency: 'USD' },
      });

      const domainOptions: CreateProductDomainOptions =
        mapper.toDomain(command);

      expect(domainOptions.name).toBeInstanceOf(ProductNameValueObject);
      expect(domainOptions.name.unpack()).toEqual(command.name);
      expect(domainOptions.price).toBeInstanceOf(ProductPriceValueObject);
      expect(domainOptions.price.unpack()).toEqual({
        amount: command.price.amount,
        currency: command.price.currency,
      });
    });
  });

  describe('toResponseDto', () => {
    it('should map ProductCreatedDomainEvent to CreateProductResponseDto', () => {
      const productId = new ID('some-product-id');
      const name = new ProductNameValueObject('Valid Name');
      const price = ProductPriceValueObject.create({
        amount: 100,
        currency: 'USD',
      });

      const domainEvent = new ProductCreatedDomainEvent({
        productId,
        details: { name, price },
      });

      const responseDto: CreateProductResponseDto =
        mapper.toResponseDto(domainEvent);

      expect(responseDto).toBeInstanceOf(CreateProductResponseDto);
      expect(responseDto.name).toEqual(name.unpack());
      expect(responseDto.price).toEqual(price.unpack());
    });
  });
});
