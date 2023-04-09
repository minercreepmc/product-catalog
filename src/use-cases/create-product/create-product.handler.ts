import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UseCaseProcessExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  CreateProductProcess,
  CreateProductValidator,
  CreateProductMapper,
} from './application-services';
import { CreateProductCommand, CreateProductResult } from './dtos';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand, CreateProductResult>
{
  constructor(
    private readonly validator: CreateProductValidator,
    private readonly createProductProcess: CreateProductProcess,
    private readonly mapper: CreateProductMapper,
  ) {}

  async execute(command: CreateProductCommand): Promise<CreateProductResult> {
    const commandValidated = this.validator.validate(command);

    if (!commandValidated.isValid) {
      return Err(
        new UseCaseCommandValidationExceptions(commandValidated.exceptions),
      );
    }

    const domainOptions = this.mapper.toDomain(command);

    const createProductResult = await this.createProductProcess.execute(
      domainOptions,
    );
    if (createProductResult.isErr()) {
      return Err(new UseCaseProcessExceptions(createProductResult.unwrapErr()));
    }

    return Ok(this.mapper.toResponseDto(createProductResult.unwrap()));
  }
}
