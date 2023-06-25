import { ISagaExceptions } from './saga-exceptions.interface';

export class SagaExceptions implements ISagaExceptions {
  name: string;
  exceptions: { [key: string]: any }[];

  constructor(options: ISagaExceptions) {
    this.name = options.name;
    this.exceptions = options.exceptions;
  }
}
