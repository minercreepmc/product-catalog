import { SubCategoryIdValueObject } from '@value-objects/category';
import { ID, UUID } from 'common-base-classes';

describe('SubCategoryIdValueObject', () => {
  let categoryId: SubCategoryIdValueObject;

  beforeEach(() => {
    categoryId = new SubCategoryIdValueObject();
  });

  it('should be an instance of ID', () => {
    expect(categoryId).toBeInstanceOf(ID);
  });

  it('should create a valid ProductIdValueObject with a given value', () => {
    const value = '123';
    const customProductId = new SubCategoryIdValueObject(value);
    expect(customProductId).toBeInstanceOf(SubCategoryIdValueObject);
    expect(customProductId.unpack()).toEqual(value);
  });

  it('should create a ProductIdValueObject with a new UUID when no value is provided', () => {
    const productIdWithoutValue = new SubCategoryIdValueObject();
    expect(productIdWithoutValue).toBeInstanceOf(SubCategoryIdValueObject);
    expect(UUID.isValid(productIdWithoutValue.unpack())).toBe(true);
  });
});
