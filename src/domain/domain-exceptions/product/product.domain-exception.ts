import { DomainExceptionBase } from 'common-base-classes';
import { ProductDomainExceptionCodes } from './product.domain-exception-code';

export abstract class ProductValidationException extends DomainExceptionBase {}
export abstract class ProductBusinessException extends DomainExceptionBase {}

export namespace ProductDomainExceptions {
  export class DoesNotExist extends ProductBusinessException {
    readonly message = 'Product does not exist';
    readonly code = ProductDomainExceptionCodes.DoesNotExist;
  }
  export class DoesExist extends ProductBusinessException {
    readonly message = 'Product does exist';
    readonly code = ProductDomainExceptionCodes.DoesExist;
  }

  export class IdDoesNotValid extends ProductValidationException {
    readonly message = 'Product id does not valid';
    readonly code = ProductDomainExceptionCodes.IdDoesNotValid;
  }

  export class PriceDoesNotValid extends ProductValidationException {
    readonly message = 'Product price does not valid';
    readonly code = ProductDomainExceptionCodes.PriceDoesNotValid;
  }

  export class NameDoesNotValid extends ProductValidationException {
    readonly message = 'Product name does not valid';
    readonly code = ProductDomainExceptionCodes.NameDoesNotValid;
  }

  export class DescriptionDoesNotValid extends ProductValidationException {
    readonly message = 'Product description does not valid';
    readonly code = ProductDomainExceptionCodes.DescriptionDoesNotValid;
  }

  export class ImageDoesNotValid extends ProductValidationException {
    readonly message = 'Product image does not valid';
    readonly code = ProductDomainExceptionCodes.ImageDoesNotValid;
  }

  export class AtributeDoesNotValid extends ProductValidationException {
    readonly message = 'Product attribute does not valid';
    readonly code = ProductDomainExceptionCodes.AtributeDoesNotValid;
  }

  export class NotSubmittedForApproval extends ProductValidationException {
    readonly message = 'Product not submitted for approval';
    readonly code = ProductDomainExceptionCodes.NotSubmittedForApproval;
  }

  export class RejectionReasonDoesNotValid extends ProductValidationException {
    readonly message = 'Product rejection reason does not valid';
    readonly code = ProductDomainExceptionCodes.RejectionReasonDoesNotValid;
  }
}
