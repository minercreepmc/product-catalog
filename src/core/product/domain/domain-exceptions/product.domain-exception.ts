import { DomainExceptionBase } from 'common-base-classes';
import { ProductDomainExceptionCode } from './product.domain-exception-code';

export abstract class ProductValidationException extends DomainExceptionBase {}
export abstract class ProductBusinessException extends DomainExceptionBase {}

export namespace ProductDomainException {
  export class IsNotExist extends ProductBusinessException {
    readonly message = 'Product is not exist';
    readonly code = ProductDomainExceptionCode.ProductIsNotExist;
  }
  export class IsExist extends ProductBusinessException {
    readonly message = 'Product is exist';
    readonly code = ProductDomainExceptionCode.ProductIsExist;
  }
}
