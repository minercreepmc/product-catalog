import {
  NumericValueObject,
  NumericValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class DimensionHeightValueObject extends NumericValueObject<DimensionHeightValueObject> {
  constructor(value: number) {
    super(value, DimensionHeightValueObject.OPTIONS);
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
