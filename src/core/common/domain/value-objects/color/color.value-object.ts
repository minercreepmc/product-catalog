import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';
import { allowedColors } from './allowed-color';

export class ColorValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, ColorValueObject.OPTIONS);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    minLength: 1,
    maxLength: 15,
    allowWhitespace: false,
    allowUppercase: false,
    allowLowercase: true,
    allowSymbols: true,
    allowNumber: false,
    allowEmpty: false,
    allowedValues: allowedColors,
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, ColorValueObject.OPTIONS);
  }
}
