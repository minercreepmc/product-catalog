import { Notification } from '@base/patterns';

export interface ValidatorBase<Command, Failure extends Array<any>> {
  validate(command: Command): Promise<Notification<Failure>>;
}
