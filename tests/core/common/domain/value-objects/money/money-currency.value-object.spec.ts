import { MoneyCurrencyValueObject } from '@common-domain/value-objects/money';

describe('MoneyCurrencyValueObject', () => {
  it('should create a MoneyCurrencyValueObject when a valid currency is provided', () => {
    const currency = new MoneyCurrencyValueObject('USD');
    expect(currency).toBeInstanceOf(MoneyCurrencyValueObject);
  });

  it('should throw an error when an invalid currency is provided', () => {
    expect(() => new MoneyCurrencyValueObject('INVALID')).toThrow();
  });

  it('should return a ValidationResponse when validating a valid currency', () => {
    const response = MoneyCurrencyValueObject.validate('USD');
    expect(response.isValid).toBeTruthy();
  });

  it('should return a ValidationResponse when validating an invalid currency', () => {
    const response = MoneyCurrencyValueObject.validate('INVALID');
    expect(response.isValid).toBeFalsy();
  });
});
