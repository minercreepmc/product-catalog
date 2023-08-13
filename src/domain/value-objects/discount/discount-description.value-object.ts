import { DomainExceptionBase, ValueObjectBase } from '@base/domain';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { IsDefined, IsString, Length, validateSync } from 'class-validator';

export class DiscountDescriptionValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @Length(5, 500)
  value: string;

  constructor(value: string) {
    this.value = value;
  }

  validate?() {
    const exception = validateSync(this);
    if (exception.length > 0) {
      return new DiscountDomainExceptions.DescriptionDoesNotValid();
    }
  }
}
