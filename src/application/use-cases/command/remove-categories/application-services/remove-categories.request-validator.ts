import { Injectable } from '@nestjs/common';
import { CategoryRequestValidator } from '@use-cases/shared/application-services/validators';
import { RemoveCategoriesRequestDto } from '../dtos/remove-category.dto';

@Injectable()
export class RemoveCategoriesRequestValidator extends CategoryRequestValidator {
  _validate(requestDto: RemoveCategoriesRequestDto): void {
    const { ids } = requestDto;

    ids.forEach((id) => super.validateCategoryId(id));
  }
}
