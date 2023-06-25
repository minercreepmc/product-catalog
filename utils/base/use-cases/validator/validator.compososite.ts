import {
  ValidationExceptionBase,
  ValidationResponse,
} from 'common-base-classes';
import { RequestDtoBase } from '../dto.base';
import { RequestValidatorBase, TranslateOptions } from './validator.base';

export class CompositeRequestValidator extends RequestValidatorBase {
  private validators: RequestValidatorBase[] = [];
  private exceptionResponses: {
    response: ValidationResponse;
    validator: RequestValidatorBase;
  }[] = [];

  validate(requestDto: RequestDtoBase<any>): ValidationResponse {
    super.init();

    this._validate(requestDto);

    this.gatherExceptions();

    return this.getValidationResponse();
  }

  addValidator(validator: RequestValidatorBase): void {
    this.validators.push(validator);
  }

  _validate(requestDto: RequestDtoBase<any>): void {
    //
  }

  private gatherExceptions(): void {
    for (const validator of this.validators) {
      for (const [key, value] of validator.exceptions) {
        this.exceptions.set(key, value);
      }
    }
  }

  translateExceptionToUserFriendlyMessage(
    options: TranslateOptions,
  ): ValidationExceptionBase {
    let userFriendlyException = options.exception;

    for (const validator of this.validators) {
      userFriendlyException =
        validator.translateExceptionToUserFriendlyMessage(options);
      if (userFriendlyException !== options.exception) {
        break;
      }
    }

    return userFriendlyException;
  }

  protected getValidationResponse(): ValidationResponse {
    if (this.exceptions.size > 0) {
      return ValidationResponse.fail(Array.from(this.exceptions.values()));
    } else {
      return ValidationResponse.success();
    }
  }
}
