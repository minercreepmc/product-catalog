import { CommandHandlerBase } from '@base/use-cases';
import { CartUpdatedDomainEvent } from '@domain-events/cart';
import { CartManagementDomainService } from '@domain-services';
import { CartItemEntity } from '@entities';
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
      productId: string;
      price: number;
      name: string;
      amount: number;
      cartId: string;
      discount: number;
      totalPrice: number;
      imageUrl?: string;
    }[] = [];

    for (const item of items) {
      itemsValue.push({
        productId: item.productId.value,
        price: Number(item!.price.value),
        name: item!.name.value,
        amount: item.amount.value,
        cartId: item.cartId.value,
        discount: item.discount?.value,
        totalPrice: item.getTotalPrice().value,
        imageUrl: item.imageUrl?.value,
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
