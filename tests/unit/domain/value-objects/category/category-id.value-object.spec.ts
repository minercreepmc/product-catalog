import { CategoryIdValueObject } from '@value-objects/category';
import { ID, UUID } from 'common-base-classes';

describe('CategoryIdValueObject', () => {
  let categoryId: CategoryIdValueObject;

  beforeEach(() => {
    categoryId = new CategoryIdValueObject();
  });

  it('should be an instance of ID', () => {
    expect(categoryId).toBeInstanceOf(ID);
  });

  it('should create a valid ProductIdValueObject with a given value', () => {
    const value = '123';
    const customProductId = new CategoryIdValueObject(value);
    expect(customProductId).toBeInstanceOf(CategoryIdValueObject);
    expect(customProductId.unpack()).toEqual(value);
  });

  it('should create a ProductIdValueObject with a new UUID when no value is provided', () => {
    const productIdWithoutValue = new CategoryIdValueObject();
    expect(productIdWithoutValue).toBeInstanceOf(CategoryIdValueObject);
    expect(UUID.isValid(productIdWithoutValue.unpack())).toBe(true);
  });
});