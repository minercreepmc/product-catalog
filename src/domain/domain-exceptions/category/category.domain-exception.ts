import { DomainExceptionBase } from 'common-base-classes';
import { CategoryDomainExceptionCodes } from './category.domain-exception-code';

export abstract class CategoryValidationException extends DomainExceptionBase {}
export abstract class CategoryBusinessException extends DomainExceptionBase {}

export namespace CategoryDomainExceptions {
  export class DoesNotExist extends CategoryBusinessException {
    readonly message = 'Category does not exist';
    readonly code = CategoryDomainExceptionCodes.DoesNotExist;
  }

  export class ParentIdDoesNotExist extends CategoryValidationException {
    readonly message = 'Category parent id does not exist';
    readonly code = CategoryDomainExceptionCodes.ParentIdDoesNotExist;
  }

  export class SubCategoryIdDoesNotExist extends CategoryValidationException {
    readonly message = 'Category sub category id does not exist';
    readonly code = CategoryDomainExceptionCodes.SubCategoryIdDoesNotExist;
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

  export class ParentIdDoesNotValid extends CategoryValidationException {
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

  export class ParentIdAndSubCategoryIdOverlap extends CategoryValidationException {
    readonly message = 'Category parent id and sub category id overlap';
    readonly code =
      CategoryDomainExceptionCodes.ParentIdAndSubCategoryIdOverlap;
  }

  export class OverlapWithSubCategoryId extends CategoryValidationException {
    readonly message = 'Category overlap with sub category id';
    readonly code = CategoryDomainExceptionCodes.OverlapWithSubCategoryId;
  }

  export class OverlapWithParentId extends CategoryValidationException {
    readonly message = 'Category overlap with parent id';
    readonly code = CategoryDomainExceptionCodes.OverlapWithParentId;
  }
}
