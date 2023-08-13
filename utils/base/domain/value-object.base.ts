import { DomainExceptionBase } from './domain-exception.base';

export interface ValueObjectBase {
  value: any;
  validate?(): DomainExceptionBase | undefined;
}
