import { Err, Ok, Result } from 'oxide.ts';
import {
  BusinessRulesEnforcer,
  CompositeBusinessRulesEnforcer,
} from './business-rules-enforcer.base';

export interface ProcessBaseOptions<Failures extends any[]> {
  businessEnforcer?: BusinessRulesEnforcer<Failures>;
  compositeBusinessEnforcer?: CompositeBusinessRulesEnforcer<Failures>;
}

export abstract class ProcessBase<Success, Failures extends any[]> {
  protected exceptions: Failures = [] as Failures;
  protected value: Success;
  private businessEnforcer: BusinessRulesEnforcer<Failures>;
  protected compositeBusinessEnforcer: CompositeBusinessRulesEnforcer<Failures>;

  constructor(options: ProcessBaseOptions<Failures>) {
    this.businessEnforcer = options.businessEnforcer;
    this.compositeBusinessEnforcer = options.compositeBusinessEnforcer;
  }

  async execute(command: any): Promise<Result<Success, Failures>> {
    this.init();
    await this.enforceBusinessRules(command);
    this.gatherExceptionsFromBusinessEnforcers();
    await this.executeMainTaskIfNoException(command);
    return this.getProcessResult();
  }

  protected abstract enforceBusinessRules(command: any): Promise<void>;
  protected abstract executeMainTask(command: any): Promise<Success>;

  private gatherExceptionsFromBusinessEnforcers() {
    if (this.businessEnforcer) {
      this.exceptions.push(...this.businessEnforcer.getExceptions());
    }

    if (this.compositeBusinessEnforcer) {
      this.exceptions.push(...this.compositeBusinessEnforcer.getExceptions());
    }
  }

  protected getEnforcer():
    | CompositeBusinessRulesEnforcer<Failures>
    | BusinessRulesEnforcer<Failures> {
    if (this.compositeBusinessEnforcer) {
      return this.compositeBusinessEnforcer;
    }

    return this.businessEnforcer;
  }

  private async executeMainTaskIfNoException(command: any) {
    if (this.hasNoExceptions()) {
      const result = await this.executeMainTask(command);
      this.value = result;
    }
  }

  protected getProcessResult(): Result<Success, Failures> {
    return this.hasNoExceptions() ? Ok(this.value) : Err(this.exceptions);
  }

  protected init() {
    this.clearExceptions();
    this.clearValue();
    this.clearExceptionsInEnforcers();
  }

  private clearExceptions() {
    this.exceptions = [] as Failures;
  }
  protected clearExceptionsInEnforcers() {
    if (this.businessEnforcer) {
      this.businessEnforcer.clear();
    }

    if (this.compositeBusinessEnforcer) {
      this.compositeBusinessEnforcer.clear();
    }
  }

  private clearValue() {
    this.value = null;
  }

  protected hasNoExceptions() {
    return this.exceptions.length === 0;
  }
}
