import { Injectable } from '@nestjs/common';
import { ReviewerCommandValidator } from '@use-cases/application-services/command-validators';
import { ValidationResponse } from 'common-base-classes';
import { CreateReviewerCommand } from '../dtos';

@Injectable()
export class CreateReviewerCommandValidator extends ReviewerCommandValidator {
  validate(command: CreateReviewerCommand): ValidationResponse {
    const { name, email } = command;

    this.clearExceptions();
    this.validateName(name);
    this.validateEmail(email);
    return this.getValidationResponse();
  }
}
