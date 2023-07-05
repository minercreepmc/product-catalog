import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class ProductImageUrlValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, ProductImageUrlValueObject.OPTIONS);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    allowNumber: true,
    allowSymbols: true,
    allowLowercase: true,
    allowUppercase: true,
    allowWhitespace: true,
    regex: /^https?:\/\/[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, this.OPTIONS);
  }
}
