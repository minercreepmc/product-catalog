import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UseCaseProcessExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  SubmitForApprovalValidator,
  SubmitForApprovalMapper,
  SubmitForApprovalProcess,
} from './application-services';
import { SubmitForApprovalCommand, SubmitForApprovalResult } from './dtos';

@CommandHandler(SubmitForApprovalCommand)
export class SubmitForApprovalHandler
  implements ICommandHandler<SubmitForApprovalCommand, SubmitForApprovalResult>
{
  constructor(
    private readonly validator: SubmitForApprovalValidator,
    private readonly mapper: SubmitForApprovalMapper,
    private readonly submitForApprovalProcess: SubmitForApprovalProcess,
  ) {}
  async execute(
    command: SubmitForApprovalCommand,
  ): Promise<SubmitForApprovalResult> {
    const commandValidated = this.validator.validate(command);
    if (!commandValidated.isValid) {
      return Err(
        new UseCaseCommandValidationExceptions(commandValidated.exceptions),
      );
    }

    const domainOptions = this.mapper.toDomain(command);

    const submitForApprovalResult = await this.submitForApprovalProcess.execute(
      domainOptions,
    );

    if (submitForApprovalResult.isErr()) {
      return Err(
        new UseCaseProcessExceptions(submitForApprovalResult.unwrapErr()),
      );
    }

    return Ok(this.mapper.toResponseDto(submitForApprovalResult.unwrap()));
  }
}
