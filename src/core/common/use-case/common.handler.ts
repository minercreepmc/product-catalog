import { ICommandHandler } from '@nestjs/cqrs';
import { ValidationResponse } from 'common-base-classes';
import { Err } from 'oxide.ts';

export abstract class CommonCommandHandler<Command, Result>
  implements ICommandHandler<Command, Result>
{
  abstract execute(command: Command): Promise<Result>;
  abstract validateCommand(command: Command): void | Err<ValidationResponse>;
  abstract validateBusinessOptions(
    options: any,
  ): Promise<void | Err<ValidationResponse>>;
}
