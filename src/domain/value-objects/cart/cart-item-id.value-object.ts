import { DomainExceptionBase, ID } from '@base/domain';
import { CartDomainException } from '@domain-exceptions/cart';
import { validateSync } from 'class-validator';

export class CartItemIdValueObject extends ID {
  value: string;
  validate?(): DomainExceptionBase {
    const validations = validateSync(this);

    if (validations.length > 0) {
      return new CartDomainException.IdDoesNotValid();
    }
  }

  constructor(value?: string) {
    super(value);
  }
}
