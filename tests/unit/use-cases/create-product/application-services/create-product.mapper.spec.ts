import { ProductCreatedDomainEvent } from '@domain-events/product';
import { CreateProductMapper } from '@use-cases/create-product/application-services';
import {
  CreateProductRequestDto,
  CreateProductDomainOptions,
  CreateProductResponseDto,
} from '@use-cases/create-product/dtos';
import {
  ProductDescriptionValueObject,
  ProductImageValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { ID } from 'common-base-classes';

describe('CreateProductMapper', () => {
  let mapper: CreateProductMapper;

  beforeEach(() => {
    mapper = new CreateProductMapper();
  });

  describe('toDomain', () => {
    it('should map CreateProductCommand to CreateProductDomainOptions', () => {
      const command = new CreateProductRequestDto({
        name: 'Valid Name',
        price: { amount: 100, currency: 'USD' },
        description: 'Valid Description',
        image: 'https://example.com/image.png',
      });

      const domainOptions: CreateProductDomainOptions =
        mapper.toDomain(command);

      const { name, description, image, price } = domainOptions;

      expect(name).toBeInstanceOf(ProductNameValueObject);
      expect(name.unpack()).toEqual(command.name);
      expect(price).toBeInstanceOf(ProductPriceValueObject);
      expect(price.unpack()).toEqual({
        amount: command.price.amount,
        currency: command.price.currency,
      });
      expect(description.unpack()).toEqual(command.description);
      expect(description).toBeInstanceOf(ProductDescriptionValueObject);
      expect(image.unpack()).toEqual(command.image);
      expect(image).toBeInstanceOf(ProductImageValueObject);
    });
  });

  it('should map required properties CreateProductDomainOptions to CreateProductResponseDto and ignore optional properties', () => {
    const command = new CreateProductRequestDto({
      name: 'Valid Name',
      price: { amount: 100, currency: 'USD' },
    });

    const domainOptions: CreateProductDomainOptions = mapper.toDomain(command);

    const { name, price } = domainOptions;

    expect(name).toBeInstanceOf(ProductNameValueObject);
    expect(name.unpack()).toEqual(command.name);
    expect(price).toBeInstanceOf(ProductPriceValueObject);
    expect(price.unpack()).toEqual({
      amount: command.price.amount,
      currency: command.price.currency,
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
      const description = new ProductDescriptionValueObject(
        'Valid Description',
      );
      const image = new ProductImageValueObject(
        'https://example.com/image.png',
      );

      const domainEvent = new ProductCreatedDomainEvent({
        productId,
        details: { name, price, description, image },
      });

      const responseDto: CreateProductResponseDto =
        mapper.toResponseDto(domainEvent);

      expect(responseDto).toBeInstanceOf(CreateProductResponseDto);
      expect(responseDto.name).toEqual(name.unpack());
      expect(responseDto.price).toEqual(price.unpack());
      expect(responseDto.image).toEqual(image.unpack());
      expect(responseDto.description).toEqual(description.unpack());
    });

    it('should map ProductCreatedDomainEvent to CreateProductResponseDto with optional properties', () => {
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
