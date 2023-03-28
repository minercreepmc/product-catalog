import { ICommand } from '@nestjs/cqrs';
import {
  CreateProductPriceValueObjectOptions,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import { ValidationResponse } from 'common-base-classes';

export abstract class ProductCommandValidator {
  abstract exceptions: Error[];
  abstract validate(command: ICommand): ValidationResponse;

  protected clearExceptions() {
    this.exceptions = [];
  }

  protected validateName(name: string): void {
    const res = ProductNameValueObject.validate(name);

    this.handlerValidationResponse(res);
  }

  protected validatePrice(price: CreateProductPriceValueObjectOptions): void {
    const res = ProductPriceValueObject.validate(price);

    this.handlerValidationResponse(res);
  }

  protected handlerValidationResponse(response: ValidationResponse): void {
    const { isValid, exceptions } = response;
    if (!isValid) {
      this.exceptions.push(...exceptions);
    }
  }

  protected getValidationResponse(): ValidationResponse {
    if (this.exceptions.length > 0) {
      return ValidationResponse.fail(this.exceptions);
    } else {
      return ValidationResponse.success();
    }
  }
}
