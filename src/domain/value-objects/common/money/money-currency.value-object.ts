import { replaceExceptionCode } from '@utils/functions';
import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export enum MoneyCurrencyEnum {
  USD = 'USD',
}

export const AllowableCurrency = Object.keys(MoneyCurrencyEnum).map(
  (key) => MoneyCurrencyEnum[key],
);

export class MoneyCurrencyValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, MoneyCurrencyValueObject.OPTIONS);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    allowWhitespace: false,
    allowEmpty: false,
    allowLowercase: false,
    allowUppercase: true,
    allowSymbols: false,
    allowNumber: false,
    allowedValues: AllowableCurrency,
  };

  static usd(): MoneyCurrencyValueObject {
    return new MoneyCurrencyValueObject(MoneyCurrencyEnum.USD);
  }

  static validate(value: string): ValidationResponse {
    const response = super.validate(value, MoneyCurrencyValueObject.OPTIONS);
    return replaceExceptionCode({
      response,
      superClass: 'TEXT',
      targetClass: 'MONEY.CURRENCY',
    });
  }
}
