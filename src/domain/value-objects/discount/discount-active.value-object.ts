import { DomainExceptionBase, ValueObjectBase } from '@base/domain';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { IsBoolean, IsDefined, validateSync } from 'class-validator';

export class DiscountActiveValueObject implements ValueObjectBase {
  @IsDefined()
  @IsBoolean()
  value: boolean;

  isActive(): boolean {
    return this.value;
  }

  constructor(value: boolean) {
    this.value = value;
  }

  validate?(): DomainExceptionBase {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new DiscountDomainExceptions.ActiveDoesNotValid();
    }
  }
}
