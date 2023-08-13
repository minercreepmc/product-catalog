import { DomainExceptionBase, ID } from '@base/domain';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { validateSync } from 'class-validator';

export class CartItemIdValueObject extends ID {
  value: string;
  validate?(): DomainExceptionBase | undefined {
    const validations = validateSync(this);

    if (validations.length > 0) {
      return new CartDomainExceptions.IdDoesNotValid();
    }
  }

  constructor(value?: string) {
    super(value);
  }
}
