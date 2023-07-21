import { DomainExceptionBase } from '@base/domain';

export interface CommandBase {
  validate?(): DomainExceptionBase[];
}
