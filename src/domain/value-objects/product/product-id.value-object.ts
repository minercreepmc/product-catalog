import { DomainExceptionBase, ID } from '@base/domain';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { validateSync } from 'class-validator';

export class ProductIdValueObject extends ID {
  validate(): DomainExceptionBase | undefined {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new ProductDomainExceptions.IdDoesNotValid();
    }
  }

  constructor(value?: string) {
    super(value);
  }
}
