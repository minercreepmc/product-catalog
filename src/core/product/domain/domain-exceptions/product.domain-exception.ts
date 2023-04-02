import { DomainExceptionBase } from 'common-base-classes';
import { ProductDomainExceptionCodes } from './product.domain-exception-code';

export abstract class ProductValidationException extends DomainExceptionBase {}
export abstract class ProductBusinessException extends DomainExceptionBase {}

export namespace ProductDomainException {
  export class IsNotExist extends ProductBusinessException {
    readonly message = 'Product is not exist';
    readonly code = ProductDomainExceptionCodes.ProductIsNotExist;
  }
  export class IsExist extends ProductBusinessException {
    readonly message = 'Product is exist';
    readonly code = ProductDomainExceptionCodes.ProductIsExist;
  }

  export class IdIsNotValid extends ProductValidationException {
    readonly message = 'Product id is not valid';
    readonly code = ProductDomainExceptionCodes.IdIsNotValid;
  }

  export class PriceIsNotValid extends ProductValidationException {
    readonly message = 'Product price is not valid';
    readonly code = ProductDomainExceptionCodes.PriceIsNotValid;
  }

  export class NameIsNotValid extends ProductValidationException {
    readonly message = 'Product name is not valid';
    readonly code = ProductDomainExceptionCodes.NameIsNotValid;
  }

  export class DescriptionIsNotValid extends ProductValidationException {
    readonly message = 'Product description is not valid';
    readonly code = ProductDomainExceptionCodes.DescriptionIsNotValid;
  }

  export class ImageIsNotValid extends ProductValidationException {
    readonly message = 'Product image is not valid';
    readonly code = ProductDomainExceptionCodes.ImageIsNotValid;
  }

  export class AtributeIsNotValid extends ProductValidationException {
    readonly message = 'Product attribute is not valid';
    readonly code = ProductDomainExceptionCodes.AtributeIsNotValid;
  }
}
