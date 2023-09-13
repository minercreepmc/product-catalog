import { DomainExceptionBase } from '@base/domain';
import { GenericDomainExceptionCodes } from './generic.domain-exception.code';

export namespace GenericDomainExceptions {
  export class FileDoesNotValid extends DomainExceptionBase {
    readonly message = 'File does not valid';
    readonly code = GenericDomainExceptionCodes.FileDoesNotValid;
  }
  export class ImageUrlDoesNotValid extends DomainExceptionBase {
    readonly message = 'Image url does not valid';
    readonly code = GenericDomainExceptionCodes.ImageUrlDoesNotValid;
  }
}
