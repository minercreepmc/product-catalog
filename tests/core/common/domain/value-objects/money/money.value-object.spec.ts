import {
  MoneyAmountValueObject,
  MoneyCurrencyValueObject,
  MoneyValueObject,
} from '@common-domain/value-objects/money';

describe('MoneyValueObject', () => {
  it('should create a MoneyValueObject when valid options are provided', () => {
    const moneyValueObject = new MoneyValueObject({
      amount: new MoneyAmountValueObject(100),
      currency: new MoneyCurrencyValueObject('USD'),
    });

    expect(moneyValueObject).toBeInstanceOf(MoneyValueObject);
  });

  it('should create a MoneyValueObject using the create method', () => {
    const moneyValueObject = new MoneyValueObject({
      amount: new MoneyAmountValueObject(100),
      currency: new MoneyCurrencyValueObject('USD'),
    });

    const createdMoneyValueObject = moneyValueObject.create({
      amount: 100,
      currency: 'USD',
    });

    expect(createdMoneyValueObject).toBeInstanceOf(MoneyValueObject);
  });

  it('should throw an error when creating a MoneyValueObject with an invalid amount', () => {
    const moneyValueObject = new MoneyValueObject({
      amount: new MoneyAmountValueObject(100),
      currency: new MoneyCurrencyValueObject('USD'),
    });

    expect(() =>
      moneyValueObject.create({
        amount: -1,
        currency: 'USD',
      }),
    ).toThrow();
  });

  it('should throw an error when creating a MoneyValueObject with an invalid currency', () => {
    const moneyValueObject = new MoneyValueObject({
      amount: new MoneyAmountValueObject(100),
      currency: new MoneyCurrencyValueObject('USD'),
    });

    expect(() =>
      moneyValueObject.create({
        amount: 100,
        currency: 'INVALID',
      }),
    ).toThrow();
  });
});
