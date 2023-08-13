import { DomainExceptionBase } from '@base/domain';
import { CartDomainExceptionCodes } from './cart.domain-exception-code';

export namespace CartDomainExceptions {
  export class DoesNotExist extends DomainExceptionBase {
    readonly message = 'Does not exist';
    readonly code = CartDomainExceptionCodes.DoesNotExist;
  }
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

  export class ItemDoesNotValid extends DomainExceptionBase {
    readonly message = 'Item does not valid';
    readonly code = CartDomainExceptionCodes.ItemDoesNotValid;
  }

  export class ItemMustBeUnique extends DomainExceptionBase {
    readonly message = 'Item must be unique';
    readonly code = CartDomainExceptionCodes.ItemMustBeUnique;
  }
  export class PriceDoesNotValid extends DomainExceptionBase {
    readonly message = 'Price does not valid';
    readonly code = CartDomainExceptionCodes.PriceDoesNotValid;
  }
}
