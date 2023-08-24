import { DomainExceptionBase, ValueObjectBase } from '@base/domain';
import { OrderDomainExceptions } from '@domain-exceptions/order';
import { IsDefined, IsNotEmpty, IsString, validateSync } from 'class-validator';

export class OrderAddressValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  value: string;
  validate?(): DomainExceptionBase | undefined {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new OrderDomainExceptions.AddressDoesNotValid();
    }
  }

  constructor(value: string) {
    this.value = value;
  }
}
