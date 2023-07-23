import { DomainExceptionBase } from '@base/domain';
import { DiscountDomainExceptionCodes } from './discount.domain-exception-code';

export namespace DiscountDomainExceptions {
  export class IdDoesNotValid implements DomainExceptionBase {
    readonly message = 'Id does not valid';
    readonly code = DiscountDomainExceptionCodes.IdDoesNotValid;
  }
  export class NameDoesNotValid implements DomainExceptionBase {
    readonly message = 'Name does not valid';
    readonly code = DiscountDomainExceptionCodes.NameDoesNotValid;
  }
  export class DescriptionDoesNotValid implements DomainExceptionBase {
    readonly message = 'Description does not valid';
    readonly code = DiscountDomainExceptionCodes.DescriptionDoesNotValid;
  }
  export class PercentageDoesNotValid implements DomainExceptionBase {
    readonly message = 'Percentage does not valid';
    readonly code = DiscountDomainExceptionCodes.PercentageDoesNotValid;
  }
  export class ActiveDoesNotValid implements DomainExceptionBase {
    readonly message = 'Active does not valid';
    readonly code = DiscountDomainExceptionCodes.ActiveDoesNotValid;
  }
  export class AlreadyExist implements DomainExceptionBase {
    readonly message = 'Already exist';
    readonly code = DiscountDomainExceptionCodes.AlreadyExists;
  }
  export class DoesNotExist implements DomainExceptionBase {
    readonly message = 'Does not exist';
    readonly code = DiscountDomainExceptionCodes.DoesNotExist;
  }
}
