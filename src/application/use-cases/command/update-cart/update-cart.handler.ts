import { UpdateCartAggregateOptions } from '@aggregates/cart';
import { DiscountAggregate } from '@aggregates/discount';
import { CommandHandlerBase } from '@base/use-cases';
import { CartUpdatedDomainEvent } from '@domain-events/cart';
import {
  CartManagementDomainService,
  DiscountVerificationDomainService,
  ProductVerificationDomainService,
} from '@domain-services';
import { CartItemEntity } from '@entities';
import { CommandHandler } from '@nestjs/cqrs';
import { ImageUrlValueObject } from '@value-objects';
import {
  UpdateCartCommand,
  UpdateCartItem,
  UpdateCartResponseDto,
} from './update-cart.dto';
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
    private readonly productVerificationService: ProductVerificationDomainService,
    private readonly discountVerificationService: DiscountVerificationDomainService,
    validator: UpdateCartValidator,
  ) {
    super(validator);
  }
  protected command: UpdateCartCommand;
  async handle(): Promise<CartUpdatedDomainEvent> {
    const { items, userId } = this.command;
    const itemsMap = await this.transformItemsToPayload(items);
    return this.cartManagementService.updateCart({
      userId,
      payload: itemsMap,
    });
  }

  async transformItemsToPayload(
    items: UpdateCartItem[],
  ): Promise<UpdateCartAggregateOptions> {
    const itemMap = new Map();
    for (const item of items) {
      const product = await this.productVerificationService.findProductOrThrow(
        item.productId,
      );

      let discount: DiscountAggregate | undefined;
      if (product.discountId) {
        discount = await this.discountVerificationService.findDiscountOrThrow(
          product.discountId,
        );
      }

      itemMap.set(
        item.productId,
        new CartItemEntity({
          productId: item.productId,
          amount: item.amount,
          cartId: item.cartId,
          name: product.name,
          price: product.price,
          imageUrl: product.image
            ? new ImageUrlValueObject(product.image.value)
            : undefined,
          discount: discount ? discount.percentage : undefined,
        }),
      );
    }
    return {
      items: itemMap,
    };
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
