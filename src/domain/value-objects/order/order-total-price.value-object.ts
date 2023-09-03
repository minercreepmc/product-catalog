import { DomainExceptionBase, ValueObjectBase } from '@base/domain';
import { OrderDomainExceptions } from '@domain-exceptions/order';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  validateSync,
} from 'class-validator';

export class OrderTotalPriceValueObject implements ValueObjectBase {
  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  value: number;
  validate?(): DomainExceptionBase | undefined {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new OrderDomainExceptions.TotalPriceDoesNotValid();
    }
  }

  constructor(value: number) {
    this.value = value;
  }
}
