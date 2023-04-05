import { ProductIdValueObject } from '@value-objects/product';
import { ID, UUID } from 'common-base-classes';

describe('ProductIdValueObject', () => {
  let productId: ProductIdValueObject;

  beforeEach(() => {
    productId = new ProductIdValueObject();
  });

  it('should be an instance of ID', () => {
    expect(productId).toBeInstanceOf(ID);
  });

  it('should create a valid ProductIdValueObject with a given value', () => {
    const value = '123';
    const customProductId = new ProductIdValueObject(value);
    expect(customProductId).toBeInstanceOf(ProductIdValueObject);
    expect(customProductId.unpack()).toEqual(value);
  });

  it('should create a ProductIdValueObject with a new UUID when no value is provided', () => {
    const productIdWithoutValue = new ProductIdValueObject();
    expect(productIdWithoutValue).toBeInstanceOf(ProductIdValueObject);
    expect(UUID.isValid(productIdWithoutValue.unpack())).toBe(true);
  });
});
