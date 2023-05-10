import { ParentCategoryIdValueObject } from '@value-objects/category';
import { ID, UUID } from 'common-base-classes';

describe('ParentCategoryIdValueObject', () => {
  let categoryId: ParentCategoryIdValueObject;

  beforeEach(() => {
    categoryId = new ParentCategoryIdValueObject();
  });

  it('should be an instance of ID', () => {
    expect(categoryId).toBeInstanceOf(ID);
  });

  it('should create a valid ProductIdValueObject with a given value', () => {
    const value = '123';
    const customProductId = new ParentCategoryIdValueObject(value);
    expect(customProductId).toBeInstanceOf(ParentCategoryIdValueObject);
    expect(customProductId.unpack()).toEqual(value);
  });

  it('should create a ProductIdValueObject with a new UUID when no value is provided', () => {
    const productIdWithoutValue = new ParentCategoryIdValueObject();
    expect(productIdWithoutValue).toBeInstanceOf(ParentCategoryIdValueObject);
    expect(UUID.isValid(productIdWithoutValue.unpack())).toBe(true);
  });
});
