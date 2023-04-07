import { ProductManagementDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import { ProductCommandValidator } from '@use-cases/application-services/command-validators';
import {
  UseCaseBusinessValidationExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  UpdateProductBusinessValidator,
  UpdateProductCommandValidator,
} from './application-services';
import { UpdateProductMapper } from './application-services/update-product.mapper';
import { UpdateProductCommand, UpdateProductResult } from './dtos';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler {
  constructor(
    private readonly commandValidator: UpdateProductCommandValidator,
    private readonly businessValidator: UpdateProductBusinessValidator,
    private readonly mapper: UpdateProductMapper,
    private readonly productManagermentService: ProductManagementDomainService,
  ) {}
  async execute(command: UpdateProductCommand): Promise<UpdateProductResult> {
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

    const productUpdated = await this.productManagermentService.updateProduct(
      domainOptions,
    );

    return Ok(this.mapper.toResponseDto(productUpdated));
  }
}
