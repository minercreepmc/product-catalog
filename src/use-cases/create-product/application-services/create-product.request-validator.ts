import { Injectable } from '@nestjs/common';
import { ProductRequestValidator } from '@use-cases/application-services/validators';
import { CreateProductRequestDto } from '../dtos';

@Injectable()
export class CreateProductRequestValidator extends ProductRequestValidator {
  _validate(command: CreateProductRequestDto): void {
    const { name, price, description, image } = command;
    this.validateName(name);
    this.validatePrice(price);
    if (description !== undefined) {
      this.validateDescription(description);
    }
    if (image !== undefined) {
      this.validateImage(image);
    }
  }
}
