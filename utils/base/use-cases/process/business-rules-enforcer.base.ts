export abstract class BusinessRulesEnforcer<Failures extends any[]> {
  exceptions: Failures = [] as Failures;
  // provideExceptions(exceptions: Failures) {
  //   this.exceptions = exceptions;
  // }
  protected addException(...exceptions: Failures) {
    this.exceptions.push(...exceptions);
  }

  public getExceptions(): Failures {
    return this.exceptions;
  }

  public clear() {
    this.exceptions = [] as Failures;
  }
}

export class CompositeBusinessRulesEnforcer<
  Failures extends any[],
> extends BusinessRulesEnforcer<Failures> {
  private enforcers: BusinessRulesEnforcer<Failures>[] = [];

  public addEnforcer(enforcer: BusinessRulesEnforcer<Failures>): void {
    this.enforcers.push(enforcer);
  }

  public getExceptions(): Failures {
    let exceptions = super.getExceptions();

    for (const enforcer of this.enforcers) {
      exceptions = [...exceptions, ...enforcer.getExceptions()] as Failures;
    }

    return exceptions as Failures;
  }

  public clear(): void {
    super.clear();

    for (const enforcer of this.enforcers) {
      enforcer.clear();
    }
  }
}
