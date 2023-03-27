import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand, UpdateProductResult } from './dtos';

@CommandHandler()
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand, UpdateProductResult>
{
  async execute(command: UpdateProductCommand): Promise<UpdateProductResult> {}
}
