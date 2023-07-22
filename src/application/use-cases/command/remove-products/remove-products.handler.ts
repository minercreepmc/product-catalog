import { CommandHandlerBase } from '@base/use-cases/command-handler/command-handler.base';
import { ProductRemovedDomainEvent } from '@domain-events/product';
import { ProductManagementDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import {
  RemoveProductsCommand,
  RemoveProductsResponseDto,
} from './remove-products.dto';
import {
  RemoveProductsFailure,
  RemoveProductsSuccess,
  RemoveProductsValidator,
} from './remove-products.validator';

@CommandHandler(RemoveProductsCommand)
export class RemoveProductsHandler extends CommandHandlerBase<
  RemoveProductsCommand,
  RemoveProductsSuccess,
  RemoveProductsFailure
> {
  handle(): Promise<ProductRemovedDomainEvent[]> {
    return this.productManagementService.removeProducts(this.command.ids);
  }

  async validate(): Promise<void> {
    const result = await this.validator.validate(this.command);

    if (result.hasExceptions()) {
      throw result.getExceptions();
    }
  }
  toResponseDto(data: ProductRemovedDomainEvent[]): RemoveProductsSuccess {
    return new RemoveProductsResponseDto({
      ids: data.map((event) => event.id.value),
    });
  }

  protected command: RemoveProductsCommand;
  constructor(
    private readonly validator: RemoveProductsValidator,
    private readonly productManagementService: ProductManagementDomainService,
  ) {
    super();
  }
}
