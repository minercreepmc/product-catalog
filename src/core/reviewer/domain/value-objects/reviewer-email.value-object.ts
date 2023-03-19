import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class ReviewerEmailValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, ReviewerEmailValueObject.OPTIONS);
  }

  static readonly OPTIONS: TextValueObjectOptions = {
    minLength: 5,
    maxLength: 50,
    allowWhitespace: false,
    allowUppercase: false,
    allowLowercase: true,
    allowNumber: true,
    allowSymbols: true,
    regex:
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(?:\.[a-zA-Z]{2,})$/,
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, this.OPTIONS);
  }
}
