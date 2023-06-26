import {
  ValidationExceptionBase,
  ValidationResponse,
} from 'common-base-classes';
import { RequestDtoBase } from '../dto.base';

export interface HandlerValidationResponseOptions {
  response: ValidationResponse;
  context?: string;
}

export interface TranslateOptions {
  exception: ValidationExceptionBase;
  context?: string;
}

export abstract class RequestValidatorBase {
  exceptions: Map<string, ValidationExceptionBase> = new Map();
  validate(requestDto: RequestDtoBase<any>): ValidationResponse {
    this.init();

    this._validate(requestDto);

    return this.getValidationResponse();
  }

  abstract _validate(requestDto: RequestDtoBase<any>): void;

  translateExceptionToUserFriendlyMessage(
    options: TranslateOptions,
  ): ValidationExceptionBase {
    throw new Error('Method should be overridden in a derived class');
  }

  init() {
    this.clearExceptions();
  }

  protected clearExceptions() {
    this.exceptions = new Map();
  }

  protected handlerValidationResponse(
    options: HandlerValidationResponseOptions,
  ): void {
    const { response, context } = options;
    const { isValid, exceptions } = response;
    if (!isValid) {
      exceptions.forEach((exception) => {
        const userFriendlyException =
          this.translateExceptionToUserFriendlyMessage({
            exception,
            context,
          });

        this.exceptions.set(userFriendlyException.code, userFriendlyException);
      });
    }
  }

  protected getValidationResponse(): ValidationResponse {
    if (this.exceptions.size > 0) {
      return ValidationResponse.fail(Array.from(this.exceptions.values()));
    } else {
      return ValidationResponse.success();
    }
  }
}
