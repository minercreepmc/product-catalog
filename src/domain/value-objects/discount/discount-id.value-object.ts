import { ID } from '@base/domain';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { validateSync } from 'class-validator';

export class DiscountIdValueObject extends ID {
  validate?() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new DiscountDomainExceptions.IdDoesNotValid();
    }
  }

  constructor(value?: string) {
    super(value);
  }
}
