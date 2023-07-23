import { ID } from '@base/domain';
import { validateSync } from 'class-validator';
import { CategoryDomainExceptions } from '@domain-exceptions/category';

export class CategoryIdValueObject extends ID {
  validate?() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new CategoryDomainExceptions.IdDoesNotValid();
    }
  }

  constructor(value?: string) {
    super(value);
  }
}
