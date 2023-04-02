import { replaceExceptionCode } from '@utils/functions';
import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export class ProductDescriptionValueObject extends TextValueObject {
  private static readonly OPTIONS: TextValueObjectOptions = {
    minLength: 5,
    maxLength: 500,
    allowNumber: true,
    allowWhitespace: true,
    allowUppercase: true,
    allowLowercase: true,
    allowSymbols: true,
  };
  static validate(value: string): ValidationResponse {
    const response = super.validate(
      value,
      ProductDescriptionValueObject.OPTIONS,
    );
    return replaceExceptionCode({
      response,
      superClass: 'TEXT',
      targetClass: 'PRODUCT.DESCRIPTION',
    });
  }

  constructor(value: string) {
    super(value, ProductDescriptionValueObject.OPTIONS);
  }
}
