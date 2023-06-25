import { Injectable } from '@nestjs/common';
import { CategoryRequestValidator } from '@use-cases/application-services/validators';
import { CreateCategoryRequestDto } from '../dtos';

@Injectable()
export class CreateCategoryRequestValidator extends CategoryRequestValidator {
  _validate(command: CreateCategoryRequestDto): void {
    const { productIds, parentIds, description, subCategoryIds, name } =
      command;
    this.validateName(name);
    if (description !== undefined) {
      this.validateDescription(description);
    }
    if (parentIds !== undefined) {
      this.validateParentCategoryId(parentIds);
    }

    if (subCategoryIds !== undefined) {
      this.validateSubCategoryIds(subCategoryIds);
    }

    if (productIds !== undefined) {
      this.validateProductIds(productIds);
    }
  }
}
