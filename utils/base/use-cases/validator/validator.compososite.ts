import {
  ValidationExceptionBase,
  ValidationResponse,
} from 'common-base-classes';
import { RequestDtoBase } from '../dto.base';
import { RequestValidatorBase } from './validator.base';

export abstract class CompositeRequestValidator extends RequestValidatorBase {
  private validators: Map<string, RequestValidatorBase> = new Map();

  exceptions: Map<string, ValidationExceptionBase> = new Map();

  validate(requestDto: RequestDtoBase<any>): ValidationResponse {
    this.init();

    this._validate(requestDto);

    this.gatherExceptions();

    return this.getValidationResponse();
  }

  init(): void {
    super.init();
    for (const validator of this.validators.values()) {
      validator.init();
    }
  }

  addValidator(validator: RequestValidatorBase): void {
    this.validators.set(validator.constructor.name, validator);
  }

  abstract _validate(requestDto: RequestDtoBase<any>): void;

  private gatherExceptions(): void {
    for (const validator of this.validators.values()) {
      for (const [key, value] of validator.exceptions) {
        this.exceptions.set(key, value);
      }
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
