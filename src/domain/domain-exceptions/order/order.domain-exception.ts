import { DomainExceptionBase } from '@base/domain';
import { OrderDomainExceptionCodes } from './order.domain-exception-code';

export namespace OrderDomainExceptions {
  export class IdDoesNotValid implements DomainExceptionBase {
    readonly message = 'Id does not valid';
    readonly code = OrderDomainExceptionCodes.IdDoesNotValid;
  }

  export class AddressDoesNotValid implements DomainExceptionBase {
    readonly message = 'Address does not valid';
    readonly code = OrderDomainExceptionCodes.AddressDoesNotValid;
  }

  export class StatusDoesNotValid implements DomainExceptionBase {
    readonly message = 'Status does not valid';
    readonly code = OrderDomainExceptionCodes.StatusDoesNotValid;
  }

  export class DoesNotExist implements DomainExceptionBase {
    readonly message = 'Does not exist';
    readonly code = OrderDomainExceptionCodes.DoesNotExist;
  }
}
