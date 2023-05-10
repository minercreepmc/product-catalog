import { Injectable } from '@nestjs/common';
import { CategoryValidator } from '@use-cases/application-services/validators';
import { ValidationResponse } from 'common-base-classes';
import { CreateCategoryCommand } from '../dtos';

@Injectable()
export class CreateCategoryValidator extends CategoryValidator {
  validate(command: CreateCategoryCommand): ValidationResponse {
    const { productIds, parentIds, description, subCategoryIds, name } =
      command;
    this.clearExceptions();
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

    return this.getValidationResponse();
  }
}
