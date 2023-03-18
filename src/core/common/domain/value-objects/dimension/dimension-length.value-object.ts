import {
  NumericValueObject,
  NumericValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class DimensionLengthValueObject extends NumericValueObject<DimensionLengthValueObject> {
  constructor(value: number) {
    super(value, DimensionLengthValueObject.OPTIONS);
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
