import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class MoneyCurrencyValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, MoneyCurrencyValueObject.OPTIONS);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    allowWhitespace: false,
    allowEmpty: false,
    allowLowercase: false,
    allowUppercase: true,
    allowSymbols: false,
    allowNumber: false,
    allowedValues: ['USD'],
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, MoneyCurrencyValueObject.OPTIONS);
  }
}
