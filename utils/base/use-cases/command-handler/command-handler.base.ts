import { DomainExceptionBase, MultipleExceptions } from '@base/domain';
import { ICommandHandler } from '@nestjs/cqrs';
import { Catch, DefaultCatch } from 'catch-decorator-ts';
import { Err, Ok, Result } from 'oxide.ts';

export abstract class CommandHandlerBase<
  Command,
  Success,
  Failure extends Array<any>,
> implements
    ICommandHandler<Command, Result<Success, MultipleExceptions<Failure>>>
{
  @DefaultCatch((err) => Err(err))
  @Catch(MultipleExceptions<DomainExceptionBase[]>, (err) => Err(err))
  async execute(command: Command): Promise<Result<any, any>> {
    this.command = command;
    await this.validate();

    const event = await this.handle();

    return Ok(this.toResponseDto(event));
  }

  protected abstract command: Command;
  abstract handle(): Promise<any>;
  abstract validate(): Promise<void>;
  abstract toResponseDto(data: any): Success;
}
