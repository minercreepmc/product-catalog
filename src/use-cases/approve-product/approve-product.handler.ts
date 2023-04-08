import { ProductApprovalDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UseCaseBusinessValidationExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  ApproveProductBusinessValidator,
  ApproveProductCommandValidator,
  ApproveProductMapper,
} from './application-services';
import { ApproveProductCommand, ApproveProductResult } from './dtos';

@CommandHandler(ApproveProductCommand)
export class ApproveProductHandler
  implements ICommandHandler<ApproveProductCommand, ApproveProductResult>
{
  constructor(
    private readonly commandValidator: ApproveProductCommandValidator,
    private readonly mapper: ApproveProductMapper,
    private readonly businessValidator: ApproveProductBusinessValidator,
    private readonly domainService: ProductApprovalDomainService,
  ) {}

  async execute(command: ApproveProductCommand): Promise<ApproveProductResult> {
    const commandValidated = this.commandValidator.validate(command);
    if (!commandValidated.isValid) {
      return Err(
        new UseCaseCommandValidationExceptions(commandValidated.exceptions),
      );
    }

    const domainOptions = this.mapper.toDomain(command);

    const businessValidated = await this.businessValidator.validate(
      domainOptions,
    );

    if (!businessValidated.isValid) {
      return Err(
        new UseCaseBusinessValidationExceptions(businessValidated.exceptions),
      );
    }

    const productApproved = await this.domainService.approveProduct(
      domainOptions,
    );

    return Ok(this.mapper.toResponseDto(productApproved));
  }
}
