import {
  MoneyCurrencyEnum,
  CreateMoneyValueObjectOptions,
} from '@value-objects/common/money';
import { ProductPriceValueObject } from '@value-objects/product';

describe('ProductPriceValueObject', () => {
  it('should create a valid ProductPriceValueObject with a given value', () => {
    const options: CreateMoneyValueObjectOptions = {
      amount: 19.99,
      currency: MoneyCurrencyEnum.USD,
    };
    const productPrice = ProductPriceValueObject.create(options);
    expect(productPrice).toBeInstanceOf(ProductPriceValueObject);
    expect(productPrice.unpack()).toEqual(options);
  });

  it('should throw an error when creating a ProductPriceValueObject with a value less than the minimum value', () => {
    const options: CreateMoneyValueObjectOptions = {
      amount: 0,
      currency: MoneyCurrencyEnum.USD,
    };
    expect(() => ProductPriceValueObject.create(options)).toThrow();
  });

  it('should throw an error when creating a ProductPriceValueObject with a negative value', () => {
    expect(() =>
      ProductPriceValueObject.create({
        amount: -1,
        currency: MoneyCurrencyEnum.USD,
      }),
    ).toThrow();
  });

  it('should validate a ProductPriceValueObject value according to the OPTIONS', () => {
    const validationResult = ProductPriceValueObject.validate({
      amount: 19.99,
      currency: MoneyCurrencyEnum.USD,
    });
    expect(validationResult.isValid).toBe(true);
  });

  it('should not validate a ProductPriceValueObject value when it does not meet the OPTIONS criteria', () => {
    const validationResult = ProductPriceValueObject.validate({
      amount: -1,
      currency: MoneyCurrencyEnum.USD,
    });
    expect(validationResult.isValid).toBe(false);
  });
});
