import { ProductPriceValueObject } from '@product-domain/value-objects';
import {
  ArgumentContainsNegativeException,
  ArgumentOutofBoundsException,
  MultipleExceptions,
  NumericValueObject,
} from 'common-base-classes';

describe('ProductPriceValueObject', () => {
  it('should create a valid ProductPriceValueObject with a given value', () => {
    const value = 19.99;
    const productPrice = new ProductPriceValueObject(value);
    expect(productPrice).toBeInstanceOf(NumericValueObject);
    expect(productPrice.getValue()).toEqual(value);
  });

  it('should throw an error when creating a ProductPriceValueObject with a value less than the minimum value', () => {
    const value = 0;
    try {
      new ProductPriceValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentOutofBoundsException()]),
      );
    }
  });

  it('should throw an error when creating a ProductPriceValueObject with a negative value', () => {
    const value = -1;
    try {
      new ProductPriceValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentContainsNegativeException()]),
      );
    }
  });

  it('should validate a ProductPriceValueObject value according to the OPTIONS', () => {
    const value = 19.99;
    const validationResult = ProductPriceValueObject.validate(value);
    expect(validationResult.isValid).toBe(true);
  });

  it('should not validate a ProductPriceValueObject value when it does not meet the OPTIONS criteria', () => {
    const value = -1;
    const validationResult = ProductPriceValueObject.validate(value);
    expect(validationResult.isValid).toBe(false);
  });
});
