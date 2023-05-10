import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  CreateCategoryMapper,
  CreateCategoryProcess,
  CreateCategoryValidator,
} from './application-services';
import { CreateCategoryCommand, CreateCategoryResult } from './dtos';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand, CreateCategoryResult>
{
  constructor(
    private readonly validator: CreateCategoryValidator,
    private readonly mapper: CreateCategoryMapper,
    private readonly createCategoryProcess: CreateCategoryProcess,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<CreateCategoryResult> {
    const commandValidated = this.validator.validate(command);

    if (!commandValidated.isValid) {
      return Err(
        new UseCaseCommandValidationExceptions(commandValidated.exceptions),
      );
    }

    const domainOptions = this.mapper.toDomain(command);

    const createCategoryResult = await this.createCategoryProcess.execute(
      domainOptions,
    );

    if (createCategoryResult.isErr()) {
      return Err(
        new UseCaseProcessExceptions(createCategoryResult.unwrapErr()),
      );
    }

    return Ok(this.mapper.toResponseDto(createCategoryResult.unwrap()));
  }
}
