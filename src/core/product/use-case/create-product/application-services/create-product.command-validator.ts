import { Injectable } from '@nestjs/common';
import { ProductCommandValidator } from '@product-use-case/application-services';
import { ValidationResponse } from 'common-base-classes';
import { CreateProductCommand } from '../dtos';

@Injectable()
export class CreateProductCommandValidator extends ProductCommandValidator {
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
