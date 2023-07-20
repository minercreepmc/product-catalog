import { ProductDomainExceptions } from '@domain-exceptions/product';
import { IsDefined, IsNumber, validate } from 'class-validator';

export class ProductPriceValueObject {
  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 2, allowInfinity: false, allowNaN: false })
  readonly value: number;

  static async create(value: number) {
    const price = new ProductPriceValueObject(value);
    const exceptions = await validate(price);

    if (exceptions.length > 0) {
      throw new ProductDomainExceptions.PriceDoesNotValid();
    }

    return price;
  }

  constructor(value: number) {
    this.value = value;
  }
}
