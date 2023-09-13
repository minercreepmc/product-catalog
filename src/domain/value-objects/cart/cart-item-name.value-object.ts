import { DomainExceptionBase, ValueObjectBase } from '@base/domain';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { IsDefined, IsString, validateSync } from 'class-validator';

export class CartItemNameValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  value: string;

  validate?(): DomainExceptionBase | undefined {
    const exceptions = validateSync(this);
    if (exceptions.length > 0) {
      return new CartDomainExceptions.PriceDoesNotValid();
    }
  }

  constructor(value: string) {
    this.value = value;
  }
}
