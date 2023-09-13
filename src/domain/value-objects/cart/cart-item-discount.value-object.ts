import { DomainExceptionBase, ValueObjectBase } from '@base/domain';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { IsDefined, IsNumber, Max, Min, validateSync } from 'class-validator';

export class CartItemDiscountValueObject implements ValueObjectBase {
  @IsDefined()
  @IsNumber()
  @Min(1)
  @Max(99)
  value: number;
  validate?(): DomainExceptionBase | undefined {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new CartDomainExceptions.DiscountDoesNotValid();
    }
  }

  constructor(value: number) {
    this.value = value;
  }
}
