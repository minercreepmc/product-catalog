import { Injectable } from '@nestjs/common';
import { ProductValidator } from '@use-cases/application-services/validators';
import { ValidationResponse } from 'common-base-classes';
import { UpdateProductCommand } from '../dtos';

@Injectable()
export class UpdateProductValidator extends ProductValidator {
  validate(command: UpdateProductCommand): ValidationResponse {
    const { productId, name, price, description, image } = command;

    this.clearExceptions();
    this.validateProductId(productId);
    if (name !== undefined) {
      this.validateName(name);
    }
    if (price !== undefined) {
      this.validatePrice(price);
    }

    if (description !== undefined) {
      this.validateDescription(description);
    }
    if (image !== undefined) {
      this.validateImage(image);
    }
    return this.getValidationResponse();
  }
}
