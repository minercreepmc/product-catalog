import { Injectable } from '@nestjs/common';
import { ProductCommandValidator } from '@product-use-case/application-services';
import { ValidationResponse } from 'common-base-classes';
import { CreateProductCommand } from '../dtos';

@Injectable()
export class CreateProductCommandValidator extends ProductCommandValidator {
  validate(command: CreateProductCommand): ValidationResponse {
    const { name, price } = command;
    this.clearExceptions();
    this.validateName(name);
    this.validatePrice(price);
    return this.getValidationResponse();
  }
}
