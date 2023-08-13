import { DomainExceptionBase, MultipleExceptions } from '@base/domain';

export class Notification<T extends DomainExceptionBase[]> {
  private exceptions: T = [] as unknown as T;

  getExceptions(): MultipleExceptions<T> {
    const unique = new Set(this.exceptions);
    return new MultipleExceptions(Array.from(unique) as T);
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
