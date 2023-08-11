import { DomainExceptionBase, ValueObjectBase } from '@base/domain';
import { CartDomainException } from '@domain-exceptions/cart';
import { IsDefined, IsNumber, Min, validateSync } from 'class-validator';

export class CartPriceValueObject implements ValueObjectBase {
  @IsDefined()
  @IsNumber()
  @Min(0)
  value: number;

  validate?(): DomainExceptionBase {
    const exceptions = validateSync(this);
    if (exceptions.length > 0) {
      return new CartDomainException.PriceDoesNotValid();
    }
  }

  constructor(value: number) {
    this.value = value;
  }

  plus(value: CartPriceValueObject) {
    return new CartPriceValueObject(this.value + value.value);
  }
}
