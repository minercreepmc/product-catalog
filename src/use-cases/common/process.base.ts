import { Err, Ok, Result } from 'oxide.ts';

export abstract class ProcessBase<Success, Failures extends any[]> {
  exceptions: Failures = [] as Failures;
  value: Success;
  abstract execute(domainOptions: any): Promise<Result<Success, Failures>>;
  protected abstract init(): void;

  protected clearExceptions() {
    this.exceptions = [] as Failures;
  }

  protected clearValue() {
    this.value = null;
  }

  protected getValidationResult(): Result<Success, Failures> {
    if (this.exceptions.length > 0) {
      return Err(this.exceptions);
    } else {
      return Ok(this.value);
    }
  }
}
