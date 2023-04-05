import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class ReviewerNameValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, ReviewerNameValueObject.OPTIONS);
  }

  static readonly OPTIONS: TextValueObjectOptions = {
    minLength: 2,
    maxLength: 20,
    allowEmpty: false,
    allowNumber: true,
    allowSymbols: true,
    allowLowercase: true,
    allowUppercase: true,
    allowWhitespace: true,
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, ReviewerNameValueObject.OPTIONS);
  }
}
