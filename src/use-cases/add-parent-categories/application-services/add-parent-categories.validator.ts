import { Injectable } from '@nestjs/common';
import { CategoryValidator } from '@use-cases/application-services/validators';
import { ValidationResponse } from 'common-base-classes';
import { AddParentCategoriesRequestDto } from '../dtos';

@Injectable()
export class AddParentCategoriesValidator extends CategoryValidator {
  validate(dto: AddParentCategoriesRequestDto): ValidationResponse {
    const { categoryId, parentIds: parentCategoryIds } = dto;
    this.clearExceptions();

    this.validateCategoryId(categoryId);
    this.validateParentCategoryId(parentCategoryIds);

    return this.getValidationResponse();
  }
}
