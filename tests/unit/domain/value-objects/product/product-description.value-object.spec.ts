import { ProductDescriptionValueObject } from '@value-objects/product';
import {
  ArgumentTooLongException,
  ArgumentTooShortException,
  MultipleExceptions,
  TextValueObject,
} from 'common-base-classes';

describe('ProductDescriptionValueObject', () => {
  it('should create a valid ProductDescriptionValueObject with a given value', () => {
    const value = 'This is a valid product description.';
    const productDescription = new ProductDescriptionValueObject(value);
    expect(productDescription).toBeInstanceOf(TextValueObject);
    expect(productDescription.unpack()).toEqual(value);
  });

  it('should throw an error when creating a ProductDescriptionValueObject with a value that is too short', () => {
    const value = 'Too';
    try {
      new ProductDescriptionValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentTooShortException()]),
      );
    }
  });

  it('should throw an error when creating a ProductDescriptionValueObject with a value that is too long', () => {
    const value = 'A'.repeat(501);
    try {
      new ProductDescriptionValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentTooLongException()]),
      );
    }
  });

  it('should validate a ProductDescriptionValueObject value according to the OPTIONS', () => {
    const value = 'This is a valid product description.';
    const validationResult = ProductDescriptionValueObject.validate(value);
    expect(validationResult.isValid).toBe(true);
  });

  it('should not validate a ProductDescriptionValueObject value when it does not meet the OPTIONS criteria', () => {
    const value = 'Too';
    const validationResult = ProductDescriptionValueObject.validate(value);
    expect(validationResult.isValid).toBe(false);
  });
});
