import { Injectable } from '@nestjs/common';
import { ProductRequestValidator } from '@use-cases/shared/application-services/validators';
import { CreateProductRequestDto } from '../dtos';

@Injectable()
export class CreateProductRequestValidator extends ProductRequestValidator {
  _validate(dto: CreateProductRequestDto): void {
    const { name, price, description, image } = dto;
    console.log(dto);
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
