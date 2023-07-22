export abstract class DomainExceptionBase {
  readonly message: string;
  readonly code: string;
}

export class MultipleExceptions<T extends Array<any>> {
  exceptions: T;
  constructor(exceptions: T) {
    this.exceptions = exceptions;
  }
}
