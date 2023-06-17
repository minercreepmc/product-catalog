import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { TranslateOptions, ValidatorBase } from '@base/use-cases';
import {
  ReviewerIdValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import {
  ValidationExceptionBase,
  ValidationResponse,
} from 'common-base-classes';

export interface ReviewerRequestDto {
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  password?: string;
}

export class ReviewerValidator extends ValidatorBase {
  validate(dto: ReviewerRequestDto): ValidationResponse {
    const { id, name } = dto;
    this.clearExceptions();

    if (id !== undefined) {
      this.validateReviewerId(id);
    }

    if (name !== undefined) {
      this.validateName(name);
    }

    return this.getValidationResponse();
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

  protected validateRole(role: string) {
    const response = ReviewerRoleValueObject.validate(role);

    this.handlerValidationResponse({
      response: response,
      context: ReviewerRoleValueObject.name,
    });
  }
}
