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
    const { userId, items, totalPrice } = data;

    const itemsValue: {
      product: {
        name: string;
        price: number;
        id: string;
      };
      amount: number;
      cartId: string;
    }[] = [];

    for (const item of items) {
      const product = await this.productRepository.findOneById(item.productId);

      itemsValue.push({
        product: {
          name: product!.name.value,
          price: Number(product!.price.value),
          id: product!.id.value,
        },
        amount: item.amount.value,
        cartId: item.cartId.value,
      });
    }

    return new UpdateCartResponseDto({
      id: data.id.value,
      items: itemsValue,
      userId: userId.value,
      totalPrice: totalPrice.value,
    });
  }
}
