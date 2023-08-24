import { ID } from '@base/domain';
import { OrderDomainExceptions } from '@domain-exceptions/order';
import { validateSync } from 'class-validator';

export class OrderIdValueObject extends ID {
  validate?() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new OrderDomainExceptions.IdDoesNotValid();
    }
  }

  constructor(value?: string) {
    super(value);
  }
}
