import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';
import { emailRegex } from './email-regex';

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
    regex: emailRegex,
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, this.OPTIONS);
  }
}
