import { DomainExceptionBase } from '@base/domain';
import { ProductDomainExceptionCodes } from './product.domain-exception-code';

export namespace ProductDomainExceptions {
  export class DoesNotExist extends DomainExceptionBase {
    readonly message = 'Product does not exist';
    readonly code = ProductDomainExceptionCodes.DoesNotExist;
  }
  export class AlreadyExist extends DomainExceptionBase {
    readonly message = 'Product already exist';
    readonly code = ProductDomainExceptionCodes.AlreadyExist;
  }

  export class IdDoesNotValid extends DomainExceptionBase {
    readonly message = 'Product id does not valid';
    readonly code = ProductDomainExceptionCodes.IdDoesNotValid;
  }

  export class PriceDoesNotValid extends DomainExceptionBase {
    readonly message = 'Product price does not valid';
    readonly code = ProductDomainExceptionCodes.PriceDoesNotValid;
  }

  export class NameDoesNotValid extends DomainExceptionBase {
    readonly message = 'Product name does not valid';
    readonly code = ProductDomainExceptionCodes.NameDoesNotValid;
  }

  export class DescriptionDoesNotValid extends DomainExceptionBase {
    readonly message = 'Product description does not valid';
    readonly code = ProductDomainExceptionCodes.DescriptionDoesNotValid;
  }

  export class ImageDoesNotValid extends DomainExceptionBase {
    readonly message = 'Product image does not valid';
    readonly code = ProductDomainExceptionCodes.ImageDoesNotValid;
  }

  export class AtributeDoesNotValid extends DomainExceptionBase {
    readonly message = 'Product attribute does not valid';
    readonly code = ProductDomainExceptionCodes.AtributeDoesNotValid;
  }

  export class NotSubmittedForApproval extends DomainExceptionBase {
    readonly message = 'Product not submitted for approval';
    readonly code = ProductDomainExceptionCodes.NotSubmittedForApproval;
  }

  export class RejectionReasonDoesNotValid extends DomainExceptionBase {
    readonly message = 'Product rejection reason does not valid';
    readonly code = ProductDomainExceptionCodes.RejectionReasonDoesNotValid;
  }
}
