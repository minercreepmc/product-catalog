import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { Injectable } from '@nestjs/common';
import {
  CommandValidatorBase,
  TranslateExceptionToUserFriendlyMessageOptions,
} from '@use-cases/common';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';
import {
  ValidationExceptionBase,
  ValidationResponse,
} from 'common-base-classes';

export interface ReviewerCommand {
  name?: string;
  email?: string;
  id?: string;
}

export class ReviewerCommandValidator extends CommandValidatorBase {
  validate(command: ReviewerCommand): ValidationResponse {
    const { id, name, email } = command;
    this.clearExceptions();

    if (id !== undefined) {
      this.validateReviewerId(id);
    }

    if (name !== undefined) {
      this.validateName(name);
    }

    if (email !== undefined) {
      this.validateEmail(email);
    }

    return this.getValidationResponse();
  }
  translateExceptionToUserFriendlyMessage(
    options: TranslateExceptionToUserFriendlyMessageOptions,
  ): ValidationExceptionBase {
    const { context, exception } = options;

    switch (context) {
      case ReviewerNameValueObject.name:
        return new ReviewerDomainExceptions.NameDoesNotValid();
      case ReviewerEmailValueObject.name:
        return new ReviewerDomainExceptions.EmailDoesNotValid();
      default:
        return exception;
    }
  }

  protected validateReviewerId(id: string) {
    const response = ReviewerIdValueObject.validate(id);

    this.handlerValidationResponse({
      response,
      context: ReviewerIdValueObject.name,
    });
  }

  protected validateName(name: string) {
    const response = ReviewerNameValueObject.validate(name);

    this.handlerValidationResponse({
      response,
      context: ReviewerNameValueObject.name,
    });
  }

  protected validateEmail(email: string) {
    const response = ReviewerEmailValueObject.validate(email);

    this.handlerValidationResponse({
      response,
      context: ReviewerEmailValueObject.name,
    });
  }
}
