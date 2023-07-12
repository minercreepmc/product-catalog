import { Injectable } from '@nestjs/common';
import { ProductRequestValidator } from '@use-cases/shared/application-services/validators';
import { UpdateProductRequestDto } from '../dtos';

@Injectable()
export class UpdateProductRequestValidator extends ProductRequestValidator {
  _validate(dto: UpdateProductRequestDto): void {
    const { id, name, price, description, image } = dto;

    this.validateProductId(id);
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
  }
}
