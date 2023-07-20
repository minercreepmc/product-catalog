import { DomainExceptionBase } from '@base/domain';
import { DiscountDomainExceptionCodes } from './discount.domain-exception-code';

export namespace DiscountDomainExceptions {
  export class AlreadyExist implements DomainExceptionBase {
    readonly message = 'Already exist';
    readonly code = DiscountDomainExceptionCodes.AlreadyExists;
  }
}
