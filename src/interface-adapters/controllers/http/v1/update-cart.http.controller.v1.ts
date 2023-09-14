import {
  v1ApiEndpoints,
  V1UpdateCartHttpRequest,
  V1UpdateCartHttpResponse,
} from '@api/http';
import { RequestWithUser } from '@api/http/v1/models';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { Roles } from '@application/application-services/auth/roles';
import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import {
  Body,
  ConflictException,
  Controller,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  UpdateCartCommand,
  UpdateCartResponseDto,
} from '@use-cases/command/update-cart';
import { CartAmountValueObject, CartIdValueObject } from '@value-objects/cart';
import { ProductIdValueObject } from '@value-objects/product';
import { UserIdValueObject, UserRoleEnum } from '@value-objects/user';
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
  @UseGuards(JwtAuthenticationGuard)
  @Roles(UserRoleEnum.Admin)
  execute(@Req() req: RequestWithUser, @Body() body: V1UpdateCartHttpRequest) {
    return super._execute({
      request: body,
      user: req.user,
    });
  }

  toCommand({
    request,
    user,
  }: HttpControllerBaseOption<V1UpdateCartHttpRequest>): UpdateCartCommand {
    const { items } = request!;
    const { id: userId } = user!;
    return new UpdateCartCommand({
      userId: new UserIdValueObject(userId),
      items: items.map((item) => {
        console.log(item);
        return {
          amount: new CartAmountValueObject(item.amount),
          productId: new ProductIdValueObject(item.productId),
          cartId: new CartIdValueObject(item.cartId),
        };
      }),
    });
  }

  extractResult(result: any): V1UpdateCartHttpResponse {
    return match(result, {
      Ok: (response: UpdateCartResponseDto) =>
        new V1UpdateCartHttpResponse({
          items: response.items.map((item) => ({
            amount: item.amount,
            cartId: item.cartId,
            productId: item.productId,
            name: item.name,
            price: item.price,
            discount: item.discount,
            imageUrl: item.imageUrl,
            totalPrice: item.totalPrice,
          })),
          id: response.id,
          userId: response.userId,
          totalPrice: response.totalPrice,
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
