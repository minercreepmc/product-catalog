import { ProductNameValueObject } from '@product-domain/value-objects';
import { ValidationException } from 'common-base-classes';
import { UpdateProductCommand } from '../dtos';

export class UpdateProductCommandValidator {
  exceptions: ValidationException[] = [];

  validate(command: UpdateProductCommand) {
    const { name, price } = command;
  }

  private validateName(name: string) {
    const { isvalid, } = ProductNameValueObject.validate(name);
  }
}
