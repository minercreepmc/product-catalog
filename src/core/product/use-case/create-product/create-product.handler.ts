import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProductManagementDomainService } from '@product-domain/domain-services';
import { Err, Ok } from 'oxide.ts';
import {
  CreateProductBusinessValidator,
  CreateProductCommandValidator,
  CreateProductMapper,
} from './application-services';
import {
  CreateProductCommand,
  CreateProductDomainOptions,
  CreateProductResult,
} from './dtos';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand, CreateProductResult>
{
  constructor(
    private readonly commandValidator: CreateProductCommandValidator,
    private readonly businessValidator: CreateProductBusinessValidator,
    private readonly mapper: CreateProductMapper,
    private readonly productManagementService: ProductManagementDomainService,
  ) {}

  async execute(command: CreateProductCommand): Promise<CreateProductResult> {
    this.validateCommand(command);
    const domainOptions = this.mapper.toDomain(command);
    await this.validateBusinessOptions(domainOptions);
    const productCreatedEvent =
      await this.productManagementService.createProduct(domainOptions);
    return Ok(this.mapper.toResponseDto(productCreatedEvent));
  }

  private validateCommand(command: CreateProductCommand) {
    const { isValid, exceptions } = this.commandValidator.validate(command);
    if (!isValid) {
      return Err(exceptions);
    }
  }

  private async validateBusinessOptions(
    domainOptions: CreateProductDomainOptions,
  ) {
    const { isValid, exceptions } = await this.businessValidator.validate(
      domainOptions,
    );
    if (!isValid) {
      return Err(exceptions);
    }
  }
}
