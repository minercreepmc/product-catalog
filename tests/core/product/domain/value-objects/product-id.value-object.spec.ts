import { ProductIdValueObject } from '@product-domain/value-objects';
import { UUID } from 'common-base-classes';

describe('ProductIdValueObject', () => {
  let productId: ProductIdValueObject;

  beforeEach(() => {
    productId = new ProductIdValueObject();
  });

  it('should be an instance of UUID', () => {
    expect(productId).toBeInstanceOf(UUID);
  });

  it('should create a valid ProductIdValueObject with a given value', () => {
    const value = '123e4567-e89b-12d3-a456-426614174000';
    const customProductId = new ProductIdValueObject(value);
    expect(customProductId).toBeInstanceOf(ProductIdValueObject);
    expect(customProductId.unpack()).toEqual(value);
  });

  it('should throw an error when creating a ProductIdValueObject with an invalid value', () => {
    const value = 'invalid-uuid';
    expect(() => new ProductIdValueObject(value)).toThrowError(Error);
  });

  it('should create a ProductIdValueObject with a new UUID when no value is provided', () => {
    const productIdWithoutValue = new ProductIdValueObject();
    expect(productIdWithoutValue).toBeInstanceOf(ProductIdValueObject);
    expect(UUID.isValid(productIdWithoutValue.unpack())).toBe(true);
  });
});
