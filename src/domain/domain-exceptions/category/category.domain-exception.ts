import { DomainExceptionBase } from 'common-base-classes';
import { CategoryDomainExceptionCodes } from './category.domain-exception-code';

export abstract class CategoryValidationException extends DomainExceptionBase {}
export abstract class CategoryBusinessException extends DomainExceptionBase {}

export namespace CategoryDomainExceptions {
  export class DoesNotExist extends CategoryBusinessException {
    readonly message = 'Category does not exist';
    readonly code = CategoryDomainExceptionCodes.DoesNotExist;
  }

  export class AlreadyExist extends CategoryBusinessException {
    readonly message = 'Category already exist';
    readonly code = CategoryDomainExceptionCodes.AlreadyExist;
  }

  export class IdDoesNotValid extends CategoryValidationException {
    readonly message = 'Category id does not valid';
    readonly code = CategoryDomainExceptionCodes.IdDoesNotValid;
  }

  export class NameDoesNotValid extends CategoryValidationException {
    readonly message = 'Category name does not valid';
    readonly code = CategoryDomainExceptionCodes.NameDoesNotValid;
  }

  export class ParentCategoryIdDoesNotValid extends CategoryValidationException {
    readonly message = 'Category parent id does not valid';
    readonly code = CategoryDomainExceptionCodes.ParentIdDoesNotValid;
  }

  export class SubCategoryIdsDoesNotValid extends CategoryValidationException {
    readonly message = 'Category sub category id does not valid';
    readonly code = CategoryDomainExceptionCodes.SubCategoryIdsDoesNotValid;
  }

  export class DescriptionDoesNotValid extends CategoryValidationException {
    readonly message = 'Category description does not valid';
    readonly code = CategoryDomainExceptionCodes.DescriptionDoesNotValid;
  }
}
