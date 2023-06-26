import { DomainExceptionBase } from 'common-base-classes';
import { ReviewerDomainExceptionCodes } from './reviewer.domain-exception-code';

export abstract class ReviewerValidationException extends DomainExceptionBase {}
export abstract class ReviewerBusinessException extends DomainExceptionBase {}

export namespace ReviewerDomainExceptions {
  export class DoesNotExist extends ReviewerBusinessException {
    readonly message = 'Reviewer does not exist';
    readonly code = ReviewerDomainExceptionCodes.DoesNotExist;
  }

  export class DoesExist extends ReviewerBusinessException {
    readonly message = 'Reviewer already exists';
    readonly code = ReviewerDomainExceptionCodes.DoesExist;
  }

  export class IdDoesNotValid extends ReviewerValidationException {
    readonly message = 'Reviewer id does not valid';
    readonly code = ReviewerDomainExceptionCodes.IdDoesNotValid;
  }

  export class NameDoesNotValid extends ReviewerValidationException {
    readonly message = 'Reviewer name does not valid';
    readonly code = ReviewerDomainExceptionCodes.NameDoesNotValid;
  }

  export class RoleDoesNotValid extends ReviewerValidationException {
    readonly message = 'Reviewer role does not valid';
    readonly code = ReviewerDomainExceptionCodes.RoleDoesNotValid;
  }

  export class NotAuthorized extends ReviewerValidationException {
    readonly message = 'Reviewer not authorized';
    readonly code = ReviewerDomainExceptionCodes.NotAuthorized;
  }
}
