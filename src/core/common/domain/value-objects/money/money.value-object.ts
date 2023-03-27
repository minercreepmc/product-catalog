import {
  AbstractValueObject,
  ValidationException,
  ValidationResponse,
} from 'common-base-classes';
import { MoneyAmountValueObject } from './money-amount.value-object';
import { MoneyCurrencyValueObject } from './money-currency.value-object';

export interface MoneyValueObjectDetails {
  amount: MoneyAmountValueObject;
  currency: MoneyCurrencyValueObject;
}

export interface CreateMoneyValueObjectOptions {
  amount: number;
  currency: string;
}

export class MoneyValueObject extends AbstractValueObject<MoneyValueObjectDetails> {
  constructor(details: MoneyValueObjectDetails) {
    super(details);
  }

  static create(options: CreateMoneyValueObjectOptions) {
    return new MoneyValueObject({
      amount: new MoneyAmountValueObject(options.amount),
      currency: new MoneyCurrencyValueObject(options.currency),
    });
  }

  static validate(options: CreateMoneyValueObjectOptions): ValidationResponse {
    const { currency, amount } = options;
    const exceptions: ValidationException[] = [];

    const amountRes = MoneyAmountValueObject.validate(amount);

    if (!amountRes.isValid) {
      exceptions.push(...amountRes.exceptions);
    }

    const currenctyRes = MoneyCurrencyValueObject.validate(currency);
    if (!currenctyRes.isValid) {
      exceptions.push(...currenctyRes.exceptions);
    }

    if (exceptions.length > 0) {
      return ValidationResponse.fail(exceptions);
    } else {
      return ValidationResponse.success();
    }
  }
}
