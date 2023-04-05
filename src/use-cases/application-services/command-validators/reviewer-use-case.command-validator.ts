import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  CommandValidatorBase,
  TranslateExceptionToUserFriendlyMessageOptions,
} from '@use-cases/common';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';
import { ValidationExceptionBase } from 'common-base-classes';

export abstract class ReviewerCommandValidator extends CommandValidatorBase {
  protected translateExceptionToUserFriendlyMessage(
    options: TranslateExceptionToUserFriendlyMessageOptions,
  ): ValidationExceptionBase {
    const { context, exception } = options;

    switch (context) {
      case ReviewerNameValueObject.name:
        return new ReviewerDomainExceptions.NameIsNotValid();
      case ReviewerEmailValueObject.name:
        return new ReviewerDomainExceptions.EmailIsNotValid();
      default:
        return exception;
    }
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
