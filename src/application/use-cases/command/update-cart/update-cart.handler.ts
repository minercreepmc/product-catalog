import { CommandHandlerBase } from '@base/use-cases';
import { CartUpdatedDomainEvent } from '@domain-events/cart';
import {
  productRepositoryDiToken,
  ProductRepositoryPort,
} from '@domain-interfaces';
import { CartManagementDomainService } from '@domain-services';
import { CartItemEntity } from '@entities';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { UpdateCartCommand, UpdateCartResponseDto } from './update-cart.dto';
import { UpdateCartFailure, UpdateCartSuccess } from './update-cart.result';
import { UpdateCartValidator } from './update-cart.validator';

@CommandHandler(UpdateCartCommand)
export class UpdateCartHandler extends CommandHandlerBase<
  UpdateCartCommand,
  UpdateCartSuccess,
  UpdateCartFailure
> {
  constructor(
    private readonly cartManagementService: CartManagementDomainService,
    @Inject(productRepositoryDiToken)
    private readonly productRepository: ProductRepositoryPort,
    validator: UpdateCartValidator,
  ) {
    super(validator);
  }
  protected command: UpdateCartCommand;
  handle(): Promise<CartUpdatedDomainEvent> {
    const { items, userId } = this.command;
    return this.cartManagementService.updateCart({
      userId,
      payload: {
        items: new Map(
          items.map((item) => {
            return [item.productId, new CartItemEntity(item)];
          }),
        ),
      },
    });
  }
  async toResponseDto(
    data: CartUpdatedDomainEvent,
  ): Promise<UpdateCartResponseDto> {
    const { userId, items } = data;

    const itemsValuePromises = items.map(async (item) => {
      const product = await this.productRepository.findOneById(item.productId);
      return {
        price: item.price.value,
        amount: item.amount.value,
        name: product!.name.value,
      };
    });

    const itemsValue = await Promise.all(itemsValuePromises);

    return new UpdateCartResponseDto({
      items: itemsValue,
      userId: userId.value,
    });
  }
}
