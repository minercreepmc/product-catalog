import { DomainExceptionBase } from '@base/domain';
import { CategoryDomainExceptionCodes } from './category.domain-exception-code';

export namespace CategoryDomainExceptions {
  export class DoesNotExist extends DomainExceptionBase {
    readonly message = 'Category does not exist';
    readonly code = CategoryDomainExceptionCodes.DoesNotExist;
  }

  export class AlreadyExist extends DomainExceptionBase {
    readonly message = 'Category already exist';
    readonly code = CategoryDomainExceptionCodes.AlreadyExist;
  }

  export class IdDoesNotValid extends DomainExceptionBase {
    readonly message = 'Category id does not valid';
    readonly code = CategoryDomainExceptionCodes.IdDoesNotValid;
  }

  export class NameDoesNotValid extends DomainExceptionBase {
    readonly message = 'Category name does not valid';
    readonly code = CategoryDomainExceptionCodes.NameDoesNotValid;
  }

  export class DescriptionDoesNotValid extends DomainExceptionBase {
    readonly message = 'Category description does not valid';
    readonly code = CategoryDomainExceptionCodes.DescriptionDoesNotValid;
  }
}
