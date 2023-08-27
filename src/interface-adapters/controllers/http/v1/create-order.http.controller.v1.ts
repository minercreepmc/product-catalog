import {
  RequestWithUser,
  v1ApiEndpoints,
  V1CreateOrderHttpRequest,
  V1CreateOrderHttpResponse,
} from '@api/http';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import {
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateOrderCommand,
  CreateOrderResponseDto,
} from '@use-cases/command/create-order';
import {
  OrderAddressValueObject,
  OrderTotalPriceValueObject,
} from '@value-objects/order';
import { UserIdValueObject } from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller()
@UseGuards(JwtAuthenticationGuard)
export class V1CreateOrderHttpController extends HttpControllerBase<
  V1CreateOrderHttpRequest,
  CreateOrderCommand,
  V1CreateOrderHttpResponse
> {
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }

  @Post(v1ApiEndpoints.createOrder)
  execute(@Req() req: RequestWithUser, @Body() body: V1CreateOrderHttpRequest) {
    return super._execute({
      request: body,
      user: req.user,
    });
  }

  toCommand({
    request,
    user,
  }: HttpControllerBaseOption<V1CreateOrderHttpRequest>): CreateOrderCommand {
    const { address, totalPrice } = request!;
    return new CreateOrderCommand({
      address: new OrderAddressValueObject(address),
      userId: new UserIdValueObject(user!.id),
      totalPrice: new OrderTotalPriceValueObject(totalPrice),
    });
  }
  extractResult(result: any): V1CreateOrderHttpResponse {
    return match(result, {
      Ok: (response: CreateOrderResponseDto) =>
        new V1CreateOrderHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }

        throw e;
      },
    });
  }
}
