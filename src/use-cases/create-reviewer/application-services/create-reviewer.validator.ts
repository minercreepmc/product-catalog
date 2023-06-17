import { Injectable } from '@nestjs/common';
import { ReviewerValidator } from '@use-cases/application-services/validators';
import { ValidationResponse } from 'common-base-classes';
import { CreateReviewerRequestDto } from '../dtos';

@Injectable()
export class CreateReviewerValidator extends ReviewerValidator {
  validate(dto: CreateReviewerRequestDto): ValidationResponse {
    const { name, role } = dto;

    this.clearExceptions();
    this.validateName(name);
    this.validateRole(role);
    return this.getValidationResponse();
  }
}
