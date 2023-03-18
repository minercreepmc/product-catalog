import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class ProductNameValueObject extends TextValueObject {
  private static readonly OPTIONS: TextValueObjectOptions = {
    minLength: 2,
    maxLength: 30,
    allowNumber: true,
    allowSymbols: true,
    allowLowercase: true,
    allowUppercase: true,
    allowWhitespace: true,
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, this.OPTIONS);
  }

  constructor(value: string) {
    super(value, ProductNameValueObject.OPTIONS);
  }
}
