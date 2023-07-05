import { DomainExceptionBase } from 'common-base-classes';
import { GenericDomainExceptionCodes } from './generic.domain-exception.code';

export abstract class GenericValidationException extends DomainExceptionBase {}
export abstract class GenericBusinessException extends DomainExceptionBase {}

export namespace GenericDomainExceptions {
  export class FileDoesNotValid extends GenericValidationException {
    readonly message = 'File does not valid';
    readonly code = GenericDomainExceptionCodes.FileDoesNotValid;
  }
}
