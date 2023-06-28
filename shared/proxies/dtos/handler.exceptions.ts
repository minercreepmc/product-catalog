import { IHandlerExceptions } from './handler-exceptions.interface';

export class HandlerExceptions implements IHandlerExceptions {
  name: string;
  exceptions: { [key: string]: any }[];
  constructor(options: HandlerExceptions) {
    this.name = options.name;
    this.exceptions = options.exceptions;
  }
}
