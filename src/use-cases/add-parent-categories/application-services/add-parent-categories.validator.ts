import { Injectable } from '@nestjs/common';
import { CategoryValidator } from '@use-cases/application-services/validators';
import { ValidationResponse } from 'common-base-classes';
import { AddParentCategoriesCommand } from '../dtos';

@Injectable()
export class AddParentCategoriesValidator extends CategoryValidator {
  validate(command: AddParentCategoriesCommand): ValidationResponse {
    const { categoryId, parentIds: parentCategoryIds } = command;
    this.clearExceptions();

    this.validateCategoryId(categoryId);
    this.validateParentCategoryId(parentCategoryIds);

    return this.getValidationResponse();
  }
}
