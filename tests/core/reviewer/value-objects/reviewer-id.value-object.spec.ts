import { ReviewerIdValueObject } from '@reviewer-domain/value-objects';
import { UUID } from 'common-base-classes';

describe('ReviewerIdValueObject', () => {
  let productId: ReviewerIdValueObject;

  beforeEach(() => {
    productId = new ReviewerIdValueObject();
  });

  it('should be an instance of UUID', () => {
    expect(productId).toBeInstanceOf(UUID);
  });

  it('should create a valid ReviewerIdValueObject with a given value', () => {
    const value = '123e4567-e89b-12d3-a456-426614174000';
    const customProductId = new ReviewerIdValueObject(value);
    expect(customProductId).toBeInstanceOf(ReviewerIdValueObject);
    expect(customProductId.unpack()).toEqual(value);
  });

  it('should throw an error when creating a ReviewerIdValueObject with an invalid value', () => {
    const value = 'invalid-uuid';
    expect(() => new ReviewerIdValueObject(value)).toThrowError(Error);
  });

  it('should create a ReviewerIdValueObject with a new UUID when no value is provided', () => {
    const productIdWithoutValue = new ReviewerIdValueObject();
    expect(productIdWithoutValue).toBeInstanceOf(ReviewerIdValueObject);
    expect(UUID.isValid(productIdWithoutValue.unpack())).toBe(true);
  });
});
