import { Injectable } from '@nestjs/common';
import { CategoryRequestValidator } from '@use-cases/shared/application-services/validators';
import { AddSubCategoriesRequestDto } from '../dtos';

@Injectable()
export class AddSubCategoriesRequestValidator extends CategoryRequestValidator {
  _validate(command: AddSubCategoriesRequestDto): void {
    const { categoryId, subIds: subCategoryIds } = command;

    this.validateCategoryId(categoryId);
    this.validateSubCategoryIds(subCategoryIds);
  }
}
