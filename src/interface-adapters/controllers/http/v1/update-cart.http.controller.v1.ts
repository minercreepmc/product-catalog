import {
  v1ApiEndpoints,
  V1UpdateCartHttpRequest,
  V1UpdateCartHttpResponse,
} from '@api/http';
import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import { CartItemEntity } from '@entities';
import {
  Body,
  ConflictException,
  Controller,
  Param,
  Put,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  UpdateCartCommand,
  UpdateCartResponseDto,
} from '@use-cases/command/update-cart';
import {
  CartAmountValueObject,
  CartIdValueObject,
  CartPriceValueObject,
} from '@value-objects/cart';
import { ProductIdValueObject } from '@value-objects/product';
import { UserIdValueObject } from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.updateCart)
export class V1UpdateCartHttpController extends HttpControllerBase<
  V1UpdateCartHttpRequest,
  UpdateCartCommand,
  V1UpdateCartHttpResponse
> {
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }

  @Put()
  execute(@Body() request: V1UpdateCartHttpRequest, @Param('id') id: string) {
    return super._execute({
      request,
      param: { id },
    });
  }

  toCommand({
    request,
    param,
  }: HttpControllerBaseOption<V1UpdateCartHttpRequest>): UpdateCartCommand {
    const { items, userId } = request!;
    return new UpdateCartCommand({
      cartId: new CartIdValueObject(param.id),
      userId: new UserIdValueObject(userId),
      items: items.map((item) => {
        return new CartItemEntity({
          cartId: new CartIdValueObject(param.id),
          amount: new CartAmountValueObject(item.amount),
          price: new CartPriceValueObject(item.price),
          productId: new ProductIdValueObject(item.productId),
        });
      }),
    });
  }

  extractResult(result: any): V1UpdateCartHttpResponse {
    return match(result, {
      Ok: (response: UpdateCartResponseDto) =>
        new V1UpdateCartHttpResponse({
          userId: response.userId,
          items: response.items.map((item) => ({
            id: item.id,
            price: item.price,
            amount: item.amount,
            cartId: item.cartId,
            productId: item.productId,
          })),
        }),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }
        throw e;
      },
    });
  }
}
