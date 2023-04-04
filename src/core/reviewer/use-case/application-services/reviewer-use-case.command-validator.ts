import {
  CommandValidatorBase,
  TranslateExceptionToUserFriendlyMessageOptions,
} from '@common-use-case';
import { ReviewerDomainExceptions } from '@reviewer-domain/domain-exceptions';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
} from '@reviewer-domain/value-objects';
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
