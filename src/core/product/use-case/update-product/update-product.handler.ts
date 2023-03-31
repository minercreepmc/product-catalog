import { CommandHandler } from '@nestjs/cqrs';
import { ProductManagementDomainService } from '@product-domain/domain-services';
import { ValidationResponse } from 'common-base-classes';
import { Err, Ok } from 'oxide.ts';
import {
  UpdateProductBusinessValidator,
  UpdateProductCommandValidator,
} from './application-services';
import { UpdateProductMapper } from './application-services/update-product.mapper';
import {
  UpdateProductCommand,
  UpdateProductDomainOptions,
  UpdateProductResult,
} from './dtos';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler {
  constructor(
    private readonly commandValidator: UpdateProductCommandValidator,
    private readonly businessValidator: UpdateProductBusinessValidator,
    private readonly mapper: UpdateProductMapper,
    private readonly productManagermentService: ProductManagementDomainService,
  ) {}
  async execute(command: UpdateProductCommand): Promise<UpdateProductResult> {
    this.validateCommand(command);
    const domainOptions = this.mapper.toDomain(command);
    await this.validateBusinessOptions(domainOptions);

    const productUpdated = await this.productManagermentService.updateProduct(
      domainOptions,
    );

    return Ok(this.mapper.toResponseDto(productUpdated));
  }

  validateCommand(
    command: UpdateProductCommand,
  ): void | Err<ValidationResponse> {
    const { isValid, exceptions } = this.commandValidator.validate(command);
    if (!isValid) {
      return Err(ValidationResponse.fail(exceptions));
    }
  }
  async validateBusinessOptions(
    options: UpdateProductDomainOptions,
  ): Promise<void | Err<ValidationResponse>> {
    const { isValid, exceptions } = await this.businessValidator.validate(
      options,
    );

    if (!isValid) {
      return Err(ValidationResponse.fail(exceptions));
    }
  }
}
