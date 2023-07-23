import { DomainExceptionBase, ValueObjectBase } from '@base/domain';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import {
  IsDefined,
  IsNumber,
  IsInt,
  validateSync,
  Min,
  Max,
} from 'class-validator';

export class DiscountPercentageValueObject implements ValueObjectBase {
  @IsDefined()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(100)
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  validate?(): DomainExceptionBase {
    const exception = validateSync(this);
    console.log(exception);
    if (exception.length > 0) {
      return new DiscountDomainExceptions.PercentageDoesNotValid();
    }
  }
}
