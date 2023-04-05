import {
  NumericValueObject,
  NumericValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class DimensionWidthValueObject extends NumericValueObject<DimensionWidthValueObject> {
  constructor(value: number) {
    super(value, DimensionWidthValueObject.OPTIONS);
  }

  private static readonly OPTIONS: NumericValueObjectOptions = {
    minValue: 0.01,
    maxValue: 1000,
    containsPositive: true,
    containsNegative: false,
    containsFloat: true,
    containsZero: false,
    containsInteger: true,
  };

  static validate(value: number): ValidationResponse {
    return super.validate(value, this.OPTIONS);
  }
}
