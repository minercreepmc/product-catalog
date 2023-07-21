import { ICommandBus } from '@nestjs/cqrs';

export interface HttpControllerBaseOption<Request> {
  request: Request;
  image?: Express.Multer.File;
  param?: any;
}

export abstract class HttpControllerBase<Request, Command, Response> {
  async _execute(
    options: HttpControllerBaseOption<Request>,
  ): Promise<Response> {
    const command = this.toCommand(options);

    this.validate(command);

    const result = await this.commandBus.execute(command);

    return this.extractResult(result);
  }

  abstract toCommand(options: HttpControllerBaseOption<Request>): Command;
  abstract validate(command: Command): void;
  abstract extractResult(result: any): Response;

  constructor(private readonly commandBus: ICommandBus) {}
}
