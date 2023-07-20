import { DomainExceptionBase } from '@base/domain';

export class Notification<T extends DomainExceptionBase[]> {
  private exceptions: T = [] as T;

  getExceptions(): T {
    return this.exceptions;
  }

  addException(message: DomainExceptionBase): void {
    this.exceptions.push(message);
  }

  hasExceptions(): boolean {
    return this.exceptions.length > 0;
  }

  exceptionMessage(): string {
    return this.exceptions.map((exception) => exception.message).join(', ');
  }
}
