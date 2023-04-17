import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class RejectionReasonValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, RejectionReasonValueObject.OPTIONS);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    minLength: 5,
    maxLength: 100,
    allowSymbols: true,
    allowEmpty: false,
    allowNumber: true,
    allowLowercase: true,
    allowUppercase: true,
    allowWhitespace: true,
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, RejectionReasonValueObject.OPTIONS);
  }
}
