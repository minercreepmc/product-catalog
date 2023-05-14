import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  AddSubCategoriesMapper,
  AddSubCategoriesProcess,
  AddSubCategoriesValidator,
} from './application-services';
import { AddSubCategoriesCommand, AddSubCategoriesResult } from './dtos';

@CommandHandler(AddSubCategoriesCommand)
export class AddSubCategoriesHandler
  implements ICommandHandler<AddSubCategoriesCommand, AddSubCategoriesResult>
{
  constructor(
    private readonly validator: AddSubCategoriesValidator,
    private readonly addSubCategoryProcess: AddSubCategoriesProcess,
    private readonly mapper: AddSubCategoriesMapper,
  ) {}

  async execute(
    command: AddSubCategoriesCommand,
  ): Promise<AddSubCategoriesResult> {
    const commandValidated = this.validator.validate(command);

    if (!commandValidated.isValid) {
      return Err(
        new UseCaseCommandValidationExceptions(commandValidated.exceptions),
      );
    }

    const domainOptions = this.mapper.toDomain(command);

    const addSubCategoryResult = await this.addSubCategoryProcess.execute(
      domainOptions,
    );

    if (addSubCategoryResult.isErr()) {
      return Err(
        new UseCaseProcessExceptions(addSubCategoryResult.unwrapErr()),
      );
    }

    return Ok(this.mapper.toResponseDto(addSubCategoryResult.unwrap()));
  }
}
