import { DomainExceptionBase } from 'common-base-classes';
import { ReviewerDomainExceptionCodes } from './reviewer.domain-exception-code';

export abstract class ReviewerValidationException extends DomainExceptionBase {}
export abstract class ReviewerBusinessException extends DomainExceptionBase {}

export namespace ReviewerDomainExceptions {
  export class IsNotExist extends ReviewerBusinessException {
    readonly message = 'Reviewer does not exist';
    readonly code = ReviewerDomainExceptionCodes.IsNotExist;
  }

  export class IsExist extends ReviewerBusinessException {
    readonly message = 'Reviewer already exists';
    readonly code = ReviewerDomainExceptionCodes.IsExist;
  }

  export class NameIsNotValid extends ReviewerValidationException {
    readonly message = 'Reviewer name is not valid';
    readonly code = ReviewerDomainExceptionCodes.NameIsNotValid;
  }

  export class EmailIsNotValid extends ReviewerValidationException {
    readonly message = 'Reviewer email is not valid';
    readonly code = ReviewerDomainExceptionCodes.EmailIsNotValid;
  }
}
