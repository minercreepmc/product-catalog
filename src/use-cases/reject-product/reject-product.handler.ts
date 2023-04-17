import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  RejectProductMapper,
  RejectProductProcess,
  RejectProductValidator,
} from './application-services';
import { RejectProductCommand, RejectProductResult } from './dtos';

@CommandHandler(RejectProductCommand)
export class RejectProductHandler
  implements ICommandHandler<RejectProductCommand, RejectProductResult>
{
  constructor(
    private readonly validator: RejectProductValidator,
    private readonly mapper: RejectProductMapper,
    private readonly rejectProductProcess: RejectProductProcess,
  ) {}

  async execute(command: RejectProductCommand): Promise<RejectProductResult> {
    const commandValidated = this.validator.validate(command);

    if (!commandValidated.isValid) {
      return Err(
        new UseCaseCommandValidationExceptions(commandValidated.exceptions),
      );
    }

    const domainOptions = this.mapper.toDomain(command);

    const rejectProductResult = await this.rejectProductProcess.execute(
      domainOptions,
    );

    if (rejectProductResult.isErr()) {
      return Err(new UseCaseProcessExceptions(rejectProductResult.unwrapErr()));
    }

    return Ok(this.mapper.toResponseDto(rejectProductResult.unwrap()));
  }
}
