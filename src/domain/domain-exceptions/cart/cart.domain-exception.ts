import { DomainExceptionBase } from '@base/domain';
import { CartDomainExceptionCodes } from './cart.domain-exception-code';

export namespace CartDomainException {
  export class AmountDoesNotValid extends DomainExceptionBase {
    readonly message = 'Amount does not valid';
    readonly code = CartDomainExceptionCodes.AmountDoesNotValid;
  }
  export class IdDoesNotValid extends DomainExceptionBase {
    readonly message = 'Id does not valid';
    readonly code = CartDomainExceptionCodes.IdDoesNotValid;
  }
  export class ItemIdDoesNotValid extends DomainExceptionBase {
    readonly message = 'ItemId does not valid';
    readonly code = CartDomainExceptionCodes.ItemIdDoesNotValid;
  }
  export class PriceDoesNotValid extends DomainExceptionBase {
    readonly message = 'Price does not valid';
    readonly code = CartDomainExceptionCodes.PriceDoesNotValid;
  }
}
