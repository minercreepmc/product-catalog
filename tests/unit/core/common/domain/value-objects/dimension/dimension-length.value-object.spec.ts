import { DimensionLengthValueObject } from '@common-domain/value-objects/dimension';
import {
  ArgumentContainsNegativeException,
  ArgumentOutofBoundsException,
  MultipleExceptions,
  NumericValueObject,
} from 'common-base-classes';

describe('DimensionLengthValueObject', () => {
  it('should create a valid DimensionLengthValueObject with a given value', () => {
    const value = 20.0;
    const productPrice = new DimensionLengthValueObject(value);
    expect(productPrice).toBeInstanceOf(NumericValueObject);
    expect(productPrice.unpack()).toEqual(value);
  });

  it('should throw an error when creating a DimensionLengthValueObject with a value less than the minimum value', () => {
    const value = 0;
    try {
      new DimensionLengthValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentOutofBoundsException()]),
      );
    }
  });

  it('should throw an error when creating a DimensionLengthValueObject with a negative value', () => {
    const value = -1;
    try {
      new DimensionLengthValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentContainsNegativeException()]),
      );
    }
  });

  it('should validate a DimensionLengthValueObject value according to the OPTIONS', () => {
    const value = 20.0;
    const validationResult = DimensionLengthValueObject.validate(value);
    expect(validationResult.isValid).toBe(true);
  });

  it('should not validate a DimensionLengthValueObject value when it does not meet the OPTIONS criteria', () => {
    const value = -1;
    const validationResult = DimensionLengthValueObject.validate(value);
    expect(validationResult.isValid).toBe(false);
  });
});
