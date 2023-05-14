import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  AddParentCategoriesMapper,
  AddParentCategoriesProcess,
  AddParentCategoriesValidator,
} from './application-services';
import { AddParentCategoriesCommand, AddParentCategoriesResult } from './dtos';

@CommandHandler(AddParentCategoriesCommand)
export class AddParentCategoriesHandler
  implements
    ICommandHandler<AddParentCategoriesCommand, AddParentCategoriesResult>
{
  constructor(
    private readonly validator: AddParentCategoriesValidator,
    private readonly addParentCategoriesProcess: AddParentCategoriesProcess,
    private readonly mapper: AddParentCategoriesMapper,
  ) {}

  async execute(
    command: AddParentCategoriesCommand,
  ): Promise<AddParentCategoriesResult> {
    const commandValidated = this.validator.validate(command);

    if (!commandValidated.isValid) {
      return Err(
        new UseCaseCommandValidationExceptions(commandValidated.exceptions),
      );
    }

    const domainOptions = this.mapper.toDomain(command);

    const addParentCategoriesResult =
      await this.addParentCategoriesProcess.execute(domainOptions);

    if (addParentCategoriesResult.isErr()) {
      return Err(
        new UseCaseProcessExceptions(addParentCategoriesResult.unwrapErr()),
      );
    }

    return Ok(this.mapper.toResponseDto(addParentCategoriesResult.unwrap()));
  }
}
