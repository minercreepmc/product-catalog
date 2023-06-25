import { Injectable } from '@nestjs/common';
import { CategoryRequestValidator } from '@application-services/validators';
import { ValidationResponse } from 'common-base-classes';
import { AddParentCategoriesRequestDto } from '../dtos';

@Injectable()
export class AddParentCategoriesRequestValidator extends CategoryRequestValidator {
  _validate(dto: AddParentCategoriesRequestDto): ValidationResponse {
    const { categoryId, parentIds: parentCategoryIds } = dto;
    this.clearExceptions();

    this.validateCategoryId(categoryId);
    this.validateParentCategoryId(parentCategoryIds);

    return this.getValidationResponse();
  }
}
