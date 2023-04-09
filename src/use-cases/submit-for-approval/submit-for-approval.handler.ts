import { ProductApprovalDomainService } from '@domain-services';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UseCaseProcessExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  SubmitForApprovalCommandValidator,
  SubmitForApprovalMapper,
} from './application-services';
import { SubmitForApprovalBusinessValidator } from './application-services/submit-for-approval.business-validator';
import { SubmitForApprovalCommand, SubmitForApprovalResult } from './dtos';

@CommandHandler(SubmitForApprovalCommand)
export class SubmitForApprovalHandler
  implements ICommandHandler<SubmitForApprovalCommand, SubmitForApprovalResult>
{
  constructor(
    private readonly commandValidator: SubmitForApprovalCommandValidator,
    private readonly mapper: SubmitForApprovalMapper,
    private readonly businessValidator: SubmitForApprovalBusinessValidator,
    private readonly productApprovalService: ProductApprovalDomainService,
  ) {}
  async execute(
    command: SubmitForApprovalCommand,
  ): Promise<SubmitForApprovalResult> {
    const commandValidated = this.commandValidator.validate(command);
    if (!commandValidated.isValid) {
      return Err(
        new UseCaseCommandValidationExceptions(commandValidated.exceptions),
      );
    }

    const domainOptions = this.mapper.toDomain(command);

    const businessValidated = await this.businessValidator.execute(
      domainOptions,
    );

    if (!businessValidated.isValid) {
      return Err(
        new UseCaseProcessExceptions(businessValidated.exceptions),
      );
    }

    const productSubmitted =
      await this.productApprovalService.submitForApproval(domainOptions);

    return Ok(this.mapper.toResponseDto(productSubmitted));
  }
}
