import { CommandBase } from '@base/use-cases';
import { UnprocessableEntityException } from '@nestjs/common';
import { ICommandBus } from '@nestjs/cqrs';

export interface HttpControllerBaseOption<Request> {
  request: Request;
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

    return this.extractResult(result);
  }

  abstract toCommand(options: HttpControllerBaseOption<Request>): Command;
  validate(command: Command): void {
    const exceptions = command.validate();

    if (exceptions.length > 0) {
      console.error(exceptions);
      throw new UnprocessableEntityException(exceptions);
    }
  }
  abstract extractResult(result: any): Response;

  constructor(private readonly commandBus: ICommandBus) {}
}
