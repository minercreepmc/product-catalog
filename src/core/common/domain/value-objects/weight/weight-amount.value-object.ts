import {
  NumericValueObject,
  NumericValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class WeightAmountValueObject extends NumericValueObject<WeightAmountValueObject> {
  constructor(value: number) {
    super(value);
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
    return super.validate(value, WeightAmountValueObject.OPTIONS);
  }
}
