import {
  NumericValueObject,
  NumericValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class ProductPriceValueObject extends NumericValueObject<ProductPriceValueObject> {
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
    return super.validate(value, ProductPriceValueObject.OPTIONS);
  }
}
