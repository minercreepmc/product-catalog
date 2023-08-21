import { CommandHandlerBase } from '@base/use-cases';
import { CartUpdatedDomainEvent } from '@domain-events/cart';
import { CartManagementDomainService } from '@domain-services';
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
            return [item.id, item];
          }),
        ),
      },
    });
  }
  toResponseDto(data: CartUpdatedDomainEvent): UpdateCartResponseDto {
    return new UpdateCartResponseDto({
      items: data.items.map((item) => {
        return {
          id: item.id.value,
          price: item.price.value,
          amount: item.amount.value,
          cartId: item.cartId?.value,
          productId: item.productId.value,
        };
      }),
      userId: data.userId.value,
    });
  }
}
