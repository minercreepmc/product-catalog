import { ProductManagementDomainService } from '@domain-services';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DefaultCatch } from 'catch-decorator-ts';
import { Err, Ok } from 'oxide.ts';
import {
  RemoveProductsCommand,
  RemoveProductsResponseDto,
} from './remove-products.dto';
import {
  RemoveProductsResult,
  RemoveProductsValidator,
} from './remove-products.validator';

@CommandHandler(RemoveProductsCommand)
export class RemoveProductsHandler
  implements ICommandHandler<RemoveProductsCommand, RemoveProductsResult>
{
  @DefaultCatch((err) => Err(err))
  async execute(command: RemoveProductsCommand): Promise<RemoveProductsResult> {
    const result = await this.validator.validate(command);

    if (result.hasExceptions()) {
      return Err(result.getExceptions());
    }

    const productsRemoved = await this.productManagementService.removeProducts(
      command.ids,
    );

    return Ok(
      new RemoveProductsResponseDto({
        ids: productsRemoved.map((event) => event.id.value),
      }),
    );
  }

  constructor(
    private readonly validator: RemoveProductsValidator,
    private readonly productManagementService: ProductManagementDomainService,
  ) {}
}
