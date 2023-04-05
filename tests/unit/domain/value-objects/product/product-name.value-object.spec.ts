import { ProductNameValueObject } from '@value-objects/product';
import {
  ArgumentTooLongException,
  ArgumentTooShortException,
  MultipleExceptions,
  TextValueObject,
} from 'common-base-classes';

describe('ProductNameValueObject', () => {
  it('should create a valid ProductNameValueObject with a given value', () => {
    const value = 'Test Product 1!';
    const productName = new ProductNameValueObject(value);
    expect(productName).toBeInstanceOf(TextValueObject);
    expect(productName.unpack()).toEqual(value);
  });

  it('should throw an error when creating a ProductNameValueObject with a value that is too short', () => {
    const value = 'A';
    try {
      new ProductNameValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentTooShortException()]),
      );
    }
  });

  it('should throw an error when creating a ProductNameValueObject with a value that is too long', () => {
    const value =
      'A very long product name that exceeds the maximum allowed length of 30 characters';
    try {
      new ProductNameValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentTooLongException()]),
      );
    }
  });

  it('should validate a ProductNameValueObject value according to the OPTIONS', () => {
    const value = 'Test Product 1!';
    const validationResult = ProductNameValueObject.validate(value);
    expect(validationResult.isValid).toBe(true);
  });

  it('should not validate a ProductNameValueObject value when it does not meet the OPTIONS criteria', () => {
    const value =
      'A very long product name that exceeds the maximum allowed length of 30 characters';
    const validationResult = ProductNameValueObject.validate(value);
    expect(validationResult.isValid).toBe(false);
  });
});
