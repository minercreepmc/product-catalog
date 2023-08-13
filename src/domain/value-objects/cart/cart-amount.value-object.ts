import { DomainExceptionBase, ValueObjectBase } from '@base/domain';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { IsDefined, IsNumber, Min, validateSync } from 'class-validator';

export class CartAmountValueObject implements ValueObjectBase {
  @IsDefined()
  @IsNumber()
  @Min(0)
  value: number;
  validate?(): DomainExceptionBase | undefined {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new CartDomainExceptions.AmountDoesNotValid();
    }
  }

  constructor(value: number) {
    this.value = value;
  }
}
