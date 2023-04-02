import { replaceExceptionCode } from '@utils/functions';
import {
  NumericValueObject,
  NumericValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class MoneyAmountValueObject extends NumericValueObject<MoneyAmountValueObject> {
  constructor(value: number) {
    super(value, MoneyAmountValueObject.OPTIONS);
  }

  private static readonly OPTIONS: NumericValueObjectOptions = {
    minValue: 0.01,
    maxValue: Number.MAX_SAFE_INTEGER,
    containsZero: false,
    containsFloat: true,
    containsInteger: true,
    containsNegative: false,
    containsPositive: true,
  };

  static validate(value: number): ValidationResponse {
    const response = super.validate(value, MoneyAmountValueObject.OPTIONS);
    return replaceExceptionCode({
      response,
      superClass: 'NUMBER',
      targetClass: 'MONEY.AMOUNT',
    });
  }
}
