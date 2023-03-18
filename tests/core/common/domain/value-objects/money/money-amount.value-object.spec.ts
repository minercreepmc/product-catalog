import { MoneyAmountValueObject } from '@common-domain/value-objects/money';
import {
  ArgumentContainsNegativeException,
  ArgumentOutofBoundsException,
  MultipleExceptions,
  NumericValueObject,
} from 'common-base-classes';

describe('MoneyAmountValueObject', () => {
  it('should create a valid MoneyAmountValueObject with a given value', () => {
    const value = 19.99;
    const productPrice = new MoneyAmountValueObject(value);
    expect(productPrice).toBeInstanceOf(NumericValueObject);
    expect(productPrice.getValue()).toEqual(value);
  });

  it('should throw an error when creating a MoneyAmountValueObject with a value less than the minimum value', () => {
    const value = 0;
    try {
      new MoneyAmountValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentOutofBoundsException()]),
      );
    }
  });

  it('should throw an error when creating a MoneyAmountValueObject with a negative value', () => {
    const value = -1;
    try {
      new MoneyAmountValueObject(value);
    } catch (e) {
      expect(e).toBeInstanceOf(MultipleExceptions);
      const typedExceptions = e as MultipleExceptions;
      expect(typedExceptions.exceptions).toEqual(
        expect.arrayContaining([new ArgumentContainsNegativeException()]),
      );
    }
  });

  it('should validate a MoneyAmountValueObject value according to the OPTIONS', () => {
    const value = 19.99;
    const validationResult = MoneyAmountValueObject.validate(value);
    expect(validationResult.isValid).toBe(true);
  });

  it('should not validate a MoneyAmountValueObject value when it does not meet the OPTIONS criteria', () => {
    const value = -1;
    const validationResult = MoneyAmountValueObject.validate(value);
    expect(validationResult.isValid).toBe(false);
  });
});
