import { Notification } from '@base/patterns';

export abstract class ValidatorBase<Command, Failure extends Array<any>> {
  abstract command: Command;
  abstract validate(command: Command): Promise<Notification<Failure>>;
}
