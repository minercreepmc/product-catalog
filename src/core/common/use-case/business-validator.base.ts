import {
  ValidationExceptionBase,
  ValidationResponse,
} from 'common-base-classes';

export abstract class BusinessValidatorBase {
  exceptions: ValidationExceptionBase[] = [];
  abstract validate(domainOptions: any): Promise<ValidationResponse>;

  protected clearExceptions() {
    this.exceptions = [];
  }

  protected getValidationResponse(): ValidationResponse {
    if (this.exceptions.length > 0) {
      return ValidationResponse.fail(this.exceptions);
    } else {
      return ValidationResponse.success();
    }
  }
}
