import {
  CreateMoneyValueObjectOptions,
  MoneyValueObject,
  MoneyValueObjectDetails,
} from '@value-objects/common/money';

export interface CreateProductPriceValueObjectOptions
  extends CreateMoneyValueObjectOptions {}

export class ProductPriceValueObject extends MoneyValueObject {
  constructor(details: MoneyValueObjectDetails) {
    super(details);
  }

  static create(
    options: CreateProductPriceValueObjectOptions,
  ): ProductPriceValueObject {
    const moneyValueObject = super.create(options);
    return new ProductPriceValueObject({
      amount: moneyValueObject.details.amount,
      currency: moneyValueObject.details.currency,
    });
  }
}
