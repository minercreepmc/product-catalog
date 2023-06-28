import { Injectable } from '@nestjs/common';
import { ReviewerRequestValidator } from '@use-cases/application-services/validators';
import { RemoveReviewerRequestDto } from '../dtos';

@Injectable()
export class RemoveReviewerRequestValidator extends ReviewerRequestValidator {
  _validate(dto: RemoveReviewerRequestDto): void {
    const { id } = dto;

    this.validateReviewerId(id);
  }
}
