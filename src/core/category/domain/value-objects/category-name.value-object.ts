import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class CategoryNameValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, CategoryNameValueObject.OPTIONS);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    minLength: 2,
    maxLength: 50,
    allowWhitespace: true,
    allowUppercase: true,
    allowLowercase: true,
    allowSymbols: true,
    allowNumber: true,
    allowEmpty: false,
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, CategoryNameValueObject.OPTIONS);
  }
}
