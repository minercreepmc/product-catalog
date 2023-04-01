import { Injectable } from '@nestjs/common';
import { ProductCommandValidator } from '@product-use-case/application-services';
import { ValidationResponse } from 'common-base-classes';
import { UpdateProductCommand } from '../dtos';

@Injectable()
export class UpdateProductCommandValidator extends ProductCommandValidator {
  validate(command: UpdateProductCommand): ValidationResponse {
    const { productId, name, price } = command;

    this.clearExceptions();
    this.validateProductId(productId);
    if (name !== undefined) {
      this.validateName(name);
    }
    if (price !== undefined) {
      this.validatePrice(price);
    }
    return this.getValidationResponse();
  }
}
