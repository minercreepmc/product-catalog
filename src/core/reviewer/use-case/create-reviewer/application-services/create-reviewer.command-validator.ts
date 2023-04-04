import { Injectable } from '@nestjs/common';
import { ReviewerCommandValidator } from '@reviewer-use-case/application-services';
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
