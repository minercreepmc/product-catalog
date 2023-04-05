import { CategoryIdValueObject } from '@value-objects/category';
import { UUID } from 'common-base-classes';

describe('CategoryIdValueObject', () => {
  it('should generate a valid UUID when no ID is provided', () => {
    const categoryId = new CategoryIdValueObject();
    expect(UUID.isValid(categoryId)).toBe(true);
  });

  it('should accept a valid UUID as input', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
    const categoryId = new CategoryIdValueObject(id);
    expect(categoryId.unpack()).toBe(id);
  });

  it('should throw an error when an invalid UUID is provided', () => {
    const id = 'invalid-uuid';
    expect(() => new CategoryIdValueObject(id)).toThrow();
  });
});
