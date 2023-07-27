import { CommandBase } from '@base/use-cases';
import { UnprocessableEntityException } from '@nestjs/common';
import { ICommandBus } from '@nestjs/cqrs';
import { Response as ExpressResponse } from 'express';

export interface HttpControllerBaseOption<Request> {
  request?: Request;
  response?: ExpressResponse;
  image?: Express.Multer.File;
  param?: any;
}

export abstract class HttpControllerBase<
  Request,
  Command extends CommandBase,
  Response,
> {
  async _execute(
    options: HttpControllerBaseOption<Request>,
  ): Promise<Response> {
    const command = this.toCommand(options);

    this.validate(command);

    const result = await this.commandBus.execute(command);

    return this.extractResult(result, { response: options.response });
  }

  abstract toCommand(options: HttpControllerBaseOption<Request>): Command;
  validate(command: Command): void {
    const exceptions = command.validate();

    if (exceptions.length > 0) {
      console.error(exceptions);
      throw new UnprocessableEntityException(exceptions);
    }
  }
  abstract extractResult(
    result: any,
    options?: HttpControllerBaseOption<Request>,
  ): Response;

  constructor(private readonly commandBus: ICommandBus) {}
}
