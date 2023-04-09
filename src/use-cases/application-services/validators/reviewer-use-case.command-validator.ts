import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  ValidatorBase,
  TranslateExceptionToUserFriendlyMessageOptions,
} from '@use-cases/common';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
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

export class ReviewerCommandValidator extends ValidatorBase {
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

      case ReviewerRoleValueObject.name:
        return new ReviewerDomainExceptions.RoleDoesNotValid();
      default:
        return exception;
    }
  }

  protected validateReviewerId(id: string) {
    const response = ReviewerIdValueObject.validate(id);

    this.handlerValidationResponse({
      response: response,
      context: ReviewerIdValueObject.name,
    });
  }

  protected validateName(name: string) {
    const response = ReviewerNameValueObject.validate(name);

    this.handlerValidationResponse({
      response: response,
      context: ReviewerNameValueObject.name,
    });
  }

  protected validateEmail(email: string) {
    const response = ReviewerEmailValueObject.validate(email);

    this.handlerValidationResponse({
      response: response,
      context: ReviewerEmailValueObject.name,
    });
  }

  protected validateRole(role: string) {
    const response = ReviewerRoleValueObject.validate(role);

    this.handlerValidationResponse({
      response: response,
      context: ReviewerRoleValueObject.name,
    });
  }
}
