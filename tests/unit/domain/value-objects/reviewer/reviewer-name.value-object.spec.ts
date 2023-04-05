import { ReviewerNameValueObject } from '@value-objects/reviewer';
import {
  ArgumentTooLongException,
  ArgumentTooShortException,
  MultipleExceptions,
  TextValueObject,
} from 'common-base-classes';

describe('ReviewerNameValueObject', () => {
  it('should create a valid ReviewerNameValueObject with a given value', () => {
    const value = 'Peter';
    const productName = new ReviewerNameValueObject(value);
    expect(productName).toBeInstanceOf(TextValueObject);
    expect(productName.unpack()).toEqual(value);
  });

  it('should create a valid ReviewerNameValueObject with symbols and numbers on it', () => {
    const value = 'peter-123';
    const productName = new ReviewerNameValueObject(value);
    expect(productName).toBeInstanceOf(ReviewerNameValueObject);
    expect(productName).toBeInstanceOf(TextValueObject);
    expect(productName.unpack()).toEqual(value);
  });

  it('should throw an error when creating a ReviewerNameValueObject with a value that is too short', () => {
    const value = 'A';
    try {
      new ReviewerNameValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentTooShortException()]),
      );
    }
  });

  it('should throw an error when creating a ReviewerNameValueObject with a value that is too long', () => {
    const value = 'A'.repeat(ReviewerNameValueObject.OPTIONS.maxLength + 1);
    try {
      new ReviewerNameValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentTooLongException()]),
      );
    }
  });

  it('should validate a ReviewerNameValueObject value according to the OPTIONS', () => {
    const value = 'Peter';
    const validationResult = ReviewerNameValueObject.validate(value);
    expect(validationResult.isValid).toBe(true);
  });

  it('should not validate a ReviewerNameValueObject value when it does not meet the OPTIONS criteria', () => {
    const value = 'A'.repeat(ReviewerNameValueObject.OPTIONS.maxLength + 1);
    const validationResult = ReviewerNameValueObject.validate(value);
    expect(validationResult.isValid).toBe(false);
  });
});
