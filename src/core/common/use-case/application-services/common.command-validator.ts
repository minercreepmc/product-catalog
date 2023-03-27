import {
  CreateProductPriceValueObjectOptions,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import { ValidationException, ValidationResponse } from 'common-base-classes';

export class CommonCommandValidator {
  exceptions: ValidationException[] = [];
  clearExceptions() {
    this.exceptions = [];
  }

  validateName(name: string): void {
    const res = ProductNameValueObject.validate(name);

    this.handlerValidationResponse(res);
  }

  validatePrice(price: CreateProductPriceValueObjectOptions): void {
    const res = ProductPriceValueObject.validate(price);

    this.handlerValidationResponse(res);
  }

  handlerValidationResponse(response: ValidationResponse): void {
    const { isValid, exceptions } = response;
    if (!isValid) {
      this.exceptions.push(...exceptions);
    }
  }

  getValidationResponse(): ValidationResponse {
    if (this.exceptions.length > 0) {
      return ValidationResponse.fail(this.exceptions);
    } else {
      return ValidationResponse.success();
    }
  }
}
