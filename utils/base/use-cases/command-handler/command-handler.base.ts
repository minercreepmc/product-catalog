import { DomainExceptionBase, MultipleExceptions } from '@base/domain';
import { Logger } from '@nestjs/common';
import { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Catch, DefaultCatch } from 'catch-decorator-ts';
import { Err, Ok, Result } from 'oxide.ts';
import { ValidatorBase } from '../validator.base';

export abstract class CommandHandlerBase<
  Command extends ICommand,
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

    return Ok(await this.toResponseDto(event));
  }

  protected abstract command: Command;
  abstract handle(): Promise<any>;
  async validate(): Promise<void> {
    const result = await this.validator.validate(this.command);

    if (result.hasExceptions()) {
      throw result.getExceptions();
    }
  }
  abstract toResponseDto(data: any): Promise<Success>;

  private logger = new Logger(CommandHandlerBase.name);

  constructor(protected validator: ValidatorBase<Command, Failure>) {}
}
