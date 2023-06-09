import { replaceExceptionCode } from '@utils/functions';
import { TextValueObject, TextValueObjectOptions } from 'common-base-classes';

export class SizeValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, SizeValueObject.OPTIONS);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    minLength: 1,
    maxLength: 50,
    allowEmpty: false,
    allowNumber: true,
    allowSymbols: true,
    allowLowercase: true,
    allowUppercase: true,
    allowWhitespace: true,
  };

  static validate(value: string) {
    const response = super.validate(value, SizeValueObject.OPTIONS);
    return replaceExceptionCode({
      response,
      superClass: 'TEXT',
      targetClass: 'SIZE',
    });
  }
}
