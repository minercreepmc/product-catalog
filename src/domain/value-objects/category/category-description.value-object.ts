import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class CategoryDescriptionValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, CategoryDescriptionValueObject.OPTIONS);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    minLength: 5,
    maxLength: 100,
    allowEmpty: false,
    allowNumber: true,
    allowSymbols: true,
    allowUppercase: true,
    allowLowercase: true,
    allowWhitespace: true,
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, this.OPTIONS);
  }
}
