import { Injectable } from '@nestjs/common';
import { ReviewerValidator } from '@use-cases/application-services/validators';
import { ValidationResponse } from 'common-base-classes';
import { CreateReviewerCommand } from '../dtos';

@Injectable()
export class CreateReviewerValidator extends ReviewerValidator {
  validate(command: CreateReviewerCommand): ValidationResponse {
    const { name, email, role } = command;

    this.clearExceptions();
    this.validateName(name);
    this.validateEmail(email);
    this.validateRole(role);
    return this.getValidationResponse();
  }
}
