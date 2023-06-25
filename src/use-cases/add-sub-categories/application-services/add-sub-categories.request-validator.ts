import { Injectable } from '@nestjs/common';
import { CategoryRequestValidator } from '@application-services/validators';
import { AddSubCategoriesRequestDto } from '../dtos';

@Injectable()
export class AddSubCategoriesRequestValidator extends CategoryRequestValidator {
  _validate(command: AddSubCategoriesRequestDto): void {
    const { categoryId, subCategoryIds } = command;

    this.validateCategoryId(categoryId);
    this.validateSubCategoryIds(subCategoryIds);
  }
}
