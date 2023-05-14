import { Injectable } from '@nestjs/common';
import { CategoryValidator } from '@use-cases/application-services/validators';
import { ValidationResponse } from 'common-base-classes';
import { AddSubCategoriesCommand } from '../dtos';

@Injectable()
export class AddSubCategoriesValidator extends CategoryValidator {
  validate(command: AddSubCategoriesCommand): ValidationResponse {
    const { categoryId, subCategoryIds } = command;

    this.clearExceptions();

    this.validateCategoryId(categoryId);
    this.validateSubCategoryIds(subCategoryIds);

    return this.getValidationResponse();
  }
}
