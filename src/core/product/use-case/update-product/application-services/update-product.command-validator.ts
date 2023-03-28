import { Injectable } from '@nestjs/common';
import { ProductCommandValidator } from '@product-use-case/application-services';
import { ValidationException, ValidationResponse } from 'common-base-classes';
import { UpdateProductCommand } from '../dtos';

@Injectable()
export class UpdateProductCommandValidator extends ProductCommandValidator {
  exceptions: ValidationException[] = [];
  validate(command: UpdateProductCommand): ValidationResponse {
    const { name, price } = command;

    this.clearExceptions();
    if (typeof name !== 'undefined' && name !== null) {
      this.validateName(name);
    }
    if (typeof price !== 'undefined' && price !== null) {
      this.validatePrice(price);
    }
    return this.getValidationResponse();
  }
}
