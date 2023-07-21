import { ICommandBus } from '@nestjs/cqrs';

export abstract class PostHttpControllerBase<Request, Command, Response> {
  async execute(
    request: Request,
    image?: Express.Multer.File,
  ): Promise<Response> {
    const command = this.toCommand(request, image);

    this.validate(command);

    const result = await this.commandBus.execute(command);

    return this.extractResult(result);
  }

  abstract toCommand(request: Request, image?: Express.Multer.File): Command;
  abstract validate(command: Command): void;
  abstract extractResult(result: any): Response;

  constructor(private readonly commandBus: ICommandBus) {}
}
