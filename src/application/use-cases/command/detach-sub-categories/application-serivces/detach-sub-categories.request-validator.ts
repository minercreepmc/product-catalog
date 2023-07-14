import { Injectable } from '@nestjs/common';
import { CategoryRequestValidator } from '@use-cases/shared/application-services/validators';
import { DetachSubCategoriesRequestDto } from '../dtos/detach-sub-categories.dto';

@Injectable()
export class DetachSubCategoriesRequestValidator extends CategoryRequestValidator {
  _validate(requestDto: DetachSubCategoriesRequestDto): void {
    const { categoryId, subIds: subCategoryIds } = requestDto;

    this.validateCategoryId(categoryId);
    this.validateSubCategoryIds(subCategoryIds);
  }
}
