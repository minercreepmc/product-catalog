import { Injectable } from '@nestjs/common';
import { ProductValidator } from '@use-cases/application-services/validators';
import { ValidationResponse } from 'common-base-classes';
import { CreateProductCommand } from '../dtos';

@Injectable()
export class CreateProductValidator extends ProductValidator {
  validate(command: CreateProductCommand): ValidationResponse {
    const { name, price, description, image } = command;
    this.clearExceptions();
    this.validateName(name);
    this.validatePrice(price);
    if (description !== undefined) {
      this.validateDescription(description);
    }
    if (image !== undefined) {
      this.validateImage(image);
    }
    return this.getValidationResponse();
  }
}
