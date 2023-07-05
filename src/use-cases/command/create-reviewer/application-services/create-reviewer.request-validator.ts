import { Injectable } from '@nestjs/common';
import { ReviewerRequestValidator } from '@use-cases/shared/application-services/validators';
import { CreateReviewerRequestDto } from '../dtos';

@Injectable()
export class CreateReviewerRequestValidator extends ReviewerRequestValidator {
  _validate(dto: CreateReviewerRequestDto): void {
    const { name, role } = dto;
    this.validateName(name);
    this.validateRole(role);
  }
}
