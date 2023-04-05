import { ProductManagementDomainService } from '@domain-services';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProductCommandValidator } from '@use-cases/application-services/command-validators';
import {
  UseCaseBusinessValidationExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  CreateProductBusinessValidator,
  CreateProductMapper,
} from './application-services';
import { CreateProductCommand, CreateProductResult } from './dtos';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand, CreateProductResult>
{
  constructor(
    private readonly commandValidator: ProductCommandValidator,
    private readonly businessValidator: CreateProductBusinessValidator,
    private readonly mapper: CreateProductMapper,
    private readonly productManagementService: ProductManagementDomainService,
  ) {}

  async execute(command: CreateProductCommand): Promise<CreateProductResult> {
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

    const productCreatedEvent =
      await this.productManagementService.createProduct(domainOptions);
    return Ok(this.mapper.toResponseDto(productCreatedEvent));
  }
}
