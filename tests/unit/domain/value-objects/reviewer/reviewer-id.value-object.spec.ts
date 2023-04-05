import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { ID, UUID } from 'common-base-classes';

describe('ReviewerIdValueObject', () => {
  let productId: ReviewerIdValueObject;

  beforeEach(() => {
    productId = new ReviewerIdValueObject();
  });

  it('should be an instance of ID', () => {
    expect(productId).toBeInstanceOf(ID);
  });

  it('should create a valid ReviewerIdValueObject with a given value', () => {
    const value = '123';
    const customProductId = new ReviewerIdValueObject(value);
    expect(customProductId).toBeInstanceOf(ReviewerIdValueObject);
    expect(customProductId.unpack()).toEqual(value);
  });

  it('should create a ReviewerIdValueObject with a new UUID when no value is provided', () => {
    const productIdWithoutValue = new ReviewerIdValueObject();
    expect(productIdWithoutValue).toBeInstanceOf(ReviewerIdValueObject);
    expect(UUID.isValid(productIdWithoutValue.unpack())).toBe(true);
  });
});
