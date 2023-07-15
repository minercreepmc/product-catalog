import { Injectable } from '@nestjs/common';
import { CategoryRequestValidator } from '@use-cases/shared/application-services/validators';
import { DetachParentCategoriesRequestDto } from '../dtos';

@Injectable()
export class DetachParentCategoriesRequestValidator extends CategoryRequestValidator {
  _validate(requestDto: DetachParentCategoriesRequestDto): void {
    const { parentIds, categoryId } = requestDto;

    this.validateCategoryId(categoryId);
    this.validateParentCategoryId(parentIds);
  }
}
