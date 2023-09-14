import { ProductDomainExceptions } from '@domain-exceptions/product';
import { IsDefined, IsNumber, IsPositive, validateSync } from 'class-validator';

export class ProductPriceValueObject {
  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 2, allowInfinity: false, allowNaN: false })
  @IsPositive()
  readonly value: number;

  validate() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new ProductDomainExceptions.PriceDoesNotValid();
    }
  }

  plus(value: ProductPriceValueObject) {
    return new ProductPriceValueObject(this.value + value.value);
  }

  constructor(value: number) {
    this.value = value;
  }
}
