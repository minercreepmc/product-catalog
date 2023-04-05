import { ReviewerManagementDomainService } from '@domain-services';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UseCaseBusinessValidationExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  CreateReviewerBusinessValidator,
  CreateReviewerCommandValidator,
} from './application-services';
import { CreateReviewerMapper } from './application-services/create-reviewer.mapper';
import { CreateReviewerResult } from './dtos';
import { CreateReviewerCommand } from './dtos/create-reviewer.command';

@CommandHandler(CreateReviewerCommand)
export class CreateReviewerHandler
  implements ICommandHandler<CreateReviewerCommand, CreateReviewerResult>
{
  constructor(
    private readonly commandValidator: CreateReviewerCommandValidator,
    private readonly mapper: CreateReviewerMapper,
    private readonly businessValidator: CreateReviewerBusinessValidator,
    private readonly reviewerManagementService: ReviewerManagementDomainService,
  ) {}

  async execute(command: CreateReviewerCommand): Promise<CreateReviewerResult> {
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

    const reviewerCreated = await this.reviewerManagementService.createReviewer(
      domainOptions,
    );

    return Ok(this.mapper.toResponseDto(reviewerCreated));
  }
}
