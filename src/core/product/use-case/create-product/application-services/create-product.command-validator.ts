import { Injectable } from '@nestjs/common';
import {
  CreateProductPriceValueObjectOptions,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import { ValidationException, ValidationResponse } from 'common-base-classes';
import { CreateProductCommand } from '../dtos';

@Injectable()
export class CreateProductCommandValidator {
  exceptions: ValidationException[] = [];
  validate(command: CreateProductCommand): ValidationResponse {
    const { name, price } = command;
    this.clearExceptions();
    this.validateName(name);
    this.validatePrice(price);
    return this.getValidationResponse();
  }

  private clearExceptions() {
    this.exceptions = [];
  }

  private validateName(name: string): void {
    const res = ProductNameValueObject.validate(name);

    this.handlerValidationResponse(res);
  }

  private validatePrice(price: CreateProductPriceValueObjectOptions): void {
    const res = ProductPriceValueObject.validate(price);

    this.handlerValidationResponse(res);
  }

  private handlerValidationResponse(response: ValidationResponse): void {
    const { isValid, exceptions } = response;
    if (!isValid) {
      this.exceptions.push(...exceptions);
    }
  }

  private getValidationResponse(): ValidationResponse {
    if (this.exceptions.length > 0) {
      return ValidationResponse.fail(this.exceptions);
    } else {
      return ValidationResponse.success();
    }
  }
}
