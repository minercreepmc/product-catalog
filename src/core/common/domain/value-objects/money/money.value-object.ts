import { AbstractValueObject } from 'common-base-classes';
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

  create(options: CreateMoneyValueObjectOptions): MoneyValueObject {
    return new MoneyValueObject({
      amount: new MoneyAmountValueObject(options.amount),
      currency: new MoneyCurrencyValueObject(options.currency),
    });
  }
}
