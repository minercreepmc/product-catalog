import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UseCaseProcessExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  CreateReviewerProcess,
  CreateReviewerValidator,
} from './application-services';
import { CreateReviewerMapper } from './application-services/create-reviewer.mapper';
import { CreateReviewerResult } from './dtos';
import { CreateReviewerCommand } from './dtos/create-reviewer.command';

@CommandHandler(CreateReviewerCommand)
export class CreateReviewerHandler
  implements ICommandHandler<CreateReviewerCommand, CreateReviewerResult>
{
  constructor(
    private readonly validator: CreateReviewerValidator,
    private readonly createReviewerProcess: CreateReviewerProcess,
    private readonly mapper: CreateReviewerMapper,
  ) {}

  async execute(command: CreateReviewerCommand): Promise<CreateReviewerResult> {
    const commandValidated = this.validator.validate(command);

    if (!commandValidated.isValid) {
      return Err(
        new UseCaseCommandValidationExceptions(commandValidated.exceptions),
      );
    }

    const domainOptions = this.mapper.toDomain(command);

    const createReviewerResult = await this.createReviewerProcess.execute(
      domainOptions,
    );

    if (createReviewerResult.isErr()) {
      return Err(
        new UseCaseProcessExceptions(createReviewerResult.unwrapErr()),
      );
    }

    return Ok(this.mapper.toResponseDto(createReviewerResult.unwrap()));
  }
}
