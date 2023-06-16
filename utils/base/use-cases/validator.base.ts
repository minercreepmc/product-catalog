import { ICommand } from '@nestjs/cqrs';
import {
  ValidationExceptionBase,
  ValidationResponse,
} from 'common-base-classes';

export interface HandlerValidationResponseOptions {
  response: ValidationResponse;
  context?: string;
}

export interface TranslateOptions {
  exception: ValidationExceptionBase;
  context?: string;
}

export abstract class ValidatorBase {
  exceptions: Map<string, ValidationExceptionBase> = new Map();
  abstract validate(command: ICommand): ValidationResponse;
  protected abstract translateExceptionToUserFriendlyMessage(
    options: TranslateOptions,
  ): ValidationExceptionBase;

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
