import { ID } from '@base/domain';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { validateSync } from 'class-validator';

export class UserIdValueObject extends ID {
  constructor(value?: string) {
    super(value);
  }

  validate() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new UserDomainExceptions.IdDoesNotValid();
    }
  }
}
