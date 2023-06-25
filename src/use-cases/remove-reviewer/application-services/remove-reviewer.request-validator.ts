import { ReviewerRequestValidator } from '@use-cases/application-services/validators';
import { ValidationResponse } from 'common-base-classes';
import { RemoveReviewerRequestDto } from '../dtos';

export class RemoveReviewerRequestValidator extends ReviewerRequestValidator {
  validate(dto: RemoveReviewerRequestDto): ValidationResponse {
    super.validate(dto);
    const { id } = dto;
    this.validateReviewerId(id);
    return this.getValidationResponse();
  }
}
