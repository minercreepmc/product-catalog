import {
  v1ApiEndpoints,
  V1UpdateOrderHttpResponse,
  V1UpdateOrderHttpRequest,
  RequestWithUser,
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
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  UpdateOrderCommand,
  UpdateOrderResponseDto,
} from '@use-cases/command/update-order';
import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderStatusValueObject,
} from '@value-objects/order';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.updateOrder)
@UseGuards(JwtAuthenticationGuard)
export class V1UpdateOrderHttpController extends HttpControllerBase<
  V1UpdateOrderHttpRequest,
  UpdateOrderCommand,
  V1UpdateOrderHttpResponse
> {
  @Put()
  execute(
    @Req() req: RequestWithUser,
    @Body() body: V1UpdateOrderHttpRequest,
    @Param('id') id: string,
  ) {
    return super._execute({
      param: id,
      request: body,
      user: req.user,
    });
  }

  toCommand(
    options: HttpControllerBaseOption<V1UpdateOrderHttpRequest>,
  ): UpdateOrderCommand {
    const { status, address } = options.request!;
    return new UpdateOrderCommand({
      id: new OrderIdValueObject(options.param!),
      address: address ? new OrderAddressValueObject(address) : undefined,
      status: status ? new OrderStatusValueObject(status) : undefined,
    });
  }
  extractResult(result: any): V1UpdateOrderHttpResponse {
    return match(result, {
      Ok: (res: UpdateOrderResponseDto) => new V1UpdateOrderHttpResponse(res),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }

        throw e;
      },
    });
  }

  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
}
