import { DomainExceptionBase, ValueObjectBase } from '@base/domain';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { IsDefined, IsNumber, Min, validateSync } from 'class-validator';

export class CartPriceValueObject implements ValueObjectBase {
  @IsDefined()
  @IsNumber()
  @Min(0)
  value: number;

  validate?(): DomainExceptionBase | undefined {
    const exceptions = validateSync(this);
    if (exceptions.length > 0) {
      return new CartDomainExceptions.PriceDoesNotValid();
    }
  }

  constructor(value: number) {
    this.value = value;
  }

  plus(value: CartPriceValueObject) {
    return new CartPriceValueObject(this.value + value.value);
  }
}
