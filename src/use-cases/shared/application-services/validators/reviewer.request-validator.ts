import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { TranslateOptions, RequestValidatorBase } from '@base/use-cases';
import {
  ReviewerIdValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import { ValidationExceptionBase } from 'common-base-classes';
import { CreateReviewerRequestDto } from '@use-cases/command/create-reviewer/dtos';
import { RemoveReviewerRequestDto } from '@use-cases/command/remove-reviewer/dtos';

export type ReviewerRequestDto = CreateReviewerRequestDto &
  RemoveReviewerRequestDto;

export class ReviewerRequestValidator extends RequestValidatorBase {
  _validate(requestDto: ReviewerRequestDto): void {
    throw new Error('Method not implemented.');
  }

  translateExceptionToUserFriendlyMessage(
    options: TranslateOptions,
  ): ValidationExceptionBase {
    const { context, exception } = options;

    switch (context) {
      case ReviewerNameValueObject.name:
        return new ReviewerDomainExceptions.NameDoesNotValid();
      case ReviewerRoleValueObject.name:
        return new ReviewerDomainExceptions.RoleDoesNotValid();
      case ReviewerIdValueObject.name:
        return new ReviewerDomainExceptions.IdDoesNotValid();
      default:
        return exception;
    }
  }

  validateReviewerId(id: string) {
    const response = ReviewerIdValueObject.validate(id);

    this.handlerValidationResponse({
      response: response,
      context: ReviewerIdValueObject.name,
    });
  }

  validateName(name: string) {
    const response = ReviewerNameValueObject.validate(name);

    this.handlerValidationResponse({
      response: response,
      context: ReviewerNameValueObject.name,
    });
  }

  validateRole(role: string) {
    const response = ReviewerRoleValueObject.validate(role);

    this.handlerValidationResponse({
      response: response,
      context: ReviewerRoleValueObject.name,
    });
  }
}
