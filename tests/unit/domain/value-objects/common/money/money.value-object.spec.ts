import {
  MoneyCurrencyEnum,
  MoneyAmountValueObject,
  MoneyCurrencyValueObject,
  MoneyValueObject,
} from '@value-objects/common/money';

describe('MoneyValueObject', () => {
  it('should create a MoneyValueObject when valid options are provided', () => {
    const moneyValueObject = new MoneyValueObject({
      amount: new MoneyAmountValueObject(100),
      currency: new MoneyCurrencyValueObject(MoneyCurrencyEnum.USD),
    });

    expect(moneyValueObject).toBeInstanceOf(MoneyValueObject);
  });

  it('should create a MoneyValueObject using the create method', () => {
    const createdMoneyValueObject = MoneyValueObject.create({
      amount: 100,
      currency: MoneyCurrencyEnum.USD,
    });

    expect(createdMoneyValueObject).toBeInstanceOf(MoneyValueObject);
  });

  it('should throw an error when creating a MoneyValueObject with an invalid amount', () => {
    expect(() =>
      MoneyValueObject.create({
        amount: -1,
        currency: MoneyCurrencyEnum.USD,
      }),
    ).toThrow();
  });

  it('should throw an error when creating a MoneyValueObject with an invalid currency', () => {
    expect(() =>
      MoneyValueObject.create({
        amount: 100,
        currency: 'INVALID' as unknown as MoneyCurrencyEnum,
      }),
    ).toThrow();
  });

  describe('MoneyValueObject validate method', () => {
    it('should validate a valid MoneyValueObject options', () => {
      const options = {
        amount: 100,
        currency: MoneyCurrencyEnum.USD,
      };

      const validationRes = MoneyValueObject.validate(options);

      expect(validationRes.isValid).toBe(true);
      expect(validationRes.exceptions.length).toBe(0);
    });

    it('should not validate an invalid amount', () => {
      const options = {
        amount: -10,
        currency: MoneyCurrencyEnum.USD,
      };

      const validationRes = MoneyValueObject.validate(options);

      expect(validationRes.isValid).toBe(false);
      expect(validationRes.exceptions.length).toBeGreaterThan(0);
    });

    it('should not validate an invalid currency', () => {
      const options = {
        amount: 100,
        currency: 'XYZ' as unknown as MoneyCurrencyEnum,
      };

      const validationRes = MoneyValueObject.validate(options);

      expect(validationRes.isValid).toBe(false);
      expect(validationRes.exceptions.length).toBeGreaterThan(0);
    });

    it('should not validate an invalid amount and currency', () => {
      const options = {
        amount: -10,
        currency: 'XYZ' as unknown as MoneyCurrencyEnum,
      };

      const validationRes = MoneyValueObject.validate(options);

      expect(validationRes.isValid).toBe(false);
      expect(validationRes.exceptions.length).toBeGreaterThan(0);
    });
  });
});