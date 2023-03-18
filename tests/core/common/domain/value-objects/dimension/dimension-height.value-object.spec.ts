import { DimensionHeightValueObject } from '@common-domain/value-objects/dimension';
import {
  ArgumentContainsNegativeException,
  ArgumentOutofBoundsException,
  MultipleExceptions,
  NumericValueObject,
} from 'common-base-classes';

describe('DimensionHeightValueObject', () => {
  it('should create a valid DimensionHeightValueObject with a given value', () => {
    const value = 20.0;
    const productPrice = new DimensionHeightValueObject(value);
    expect(productPrice).toBeInstanceOf(NumericValueObject);
    expect(productPrice.unpack()).toEqual(value);
  });

  it('should throw an error when creating a DimensionHeightValueObject with a value less than the minimum value', () => {
    const value = 0;
    try {
      new DimensionHeightValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentOutofBoundsException()]),
      );
    }
  });

  it('should throw an error when creating a DimensionHeightValueObject with a negative value', () => {
    const value = -1;
    try {
      new DimensionHeightValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentContainsNegativeException()]),
      );
    }
  });

  it('should validate a DimensionHeightValueObject value according to the OPTIONS', () => {
    const value = 20.0;
    const validationResult = DimensionHeightValueObject.validate(value);
    expect(validationResult.isValid).toBe(true);
  });

  it('should not validate a DimensionHeightValueObject value when it does not meet the OPTIONS criteria', () => {
    const value = -1;
    const validationResult = DimensionHeightValueObject.validate(value);
    expect(validationResult.isValid).toBe(false);
  });
});
