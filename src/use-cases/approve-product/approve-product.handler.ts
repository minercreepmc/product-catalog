import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  ApproveProductMapper,
  ApproveProductProcess,
  ApproveProductValidator,
} from './application-services';
import { ApproveProductCommand, ApproveProductResult } from './dtos';

@CommandHandler(ApproveProductCommand)
export class ApproveProductHandler
  implements ICommandHandler<ApproveProductCommand, ApproveProductResult>
{
  constructor(
    private readonly validator: ApproveProductValidator,
    private readonly mapper: ApproveProductMapper,
    private readonly approveProductProcess: ApproveProductProcess,
  ) {}

  async execute(command: ApproveProductCommand): Promise<ApproveProductResult> {
    const commandValidated = this.validator.validate(command);
    if (!commandValidated.isValid) {
      return Err(
        new UseCaseCommandValidationExceptions(commandValidated.exceptions),
      );
    }

    const domainOptions = this.mapper.toDomain(command);

    const approveProductResult = await this.approveProductProcess.execute(
      domainOptions,
    );

    if (approveProductResult.isErr()) {
      return Err(
        new UseCaseProcessExceptions(approveProductResult.unwrapErr()),
      );
    }

    return Ok(this.mapper.toResponseDto(approveProductResult.unwrap()));
  }
}
