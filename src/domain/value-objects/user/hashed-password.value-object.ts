import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class UserHashedPasswordValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, UserHashedPasswordValueObject.OPTIONS);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    minLength: 1,
    maxLength: Number.MAX_SAFE_INTEGER,
    allowWhitespace: true,
    allowUppercase: true,
    allowLowercase: true,
    allowSymbols: true,
    allowNumber: true,
    allowEmpty: false,
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, UserHashedPasswordValueObject.OPTIONS);
  }
}
