import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  RemoveDiscountsCommand,
  RemoveDiscountsResponseDto,
} from '@use-cases/command/remove-discounts';
import { DiscountIdValueObject } from '@value-objects/discount';
import { match } from 'oxide.ts';
import { V1RemoveDiscountsHttpRequest } from './remove-discounts.http.request.v1';
import { V1RemoveDiscountsHttpResponse } from './remove-discounts.http.response.v1';

@Controller('/api/v1/discount/remove')
export class V1RemoveDiscountsHttpController extends HttpControllerBase<
  V1RemoveDiscountsHttpRequest,
  RemoveDiscountsCommand,
  V1RemoveDiscountsHttpResponse
> {
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
  @Post()
  @HttpCode(HttpStatus.OK)
  execute(@Body() request: V1RemoveDiscountsHttpRequest) {
    return super._execute({
      request,
    });
  }

  toCommand(
    options: HttpControllerBaseOption<V1RemoveDiscountsHttpRequest>,
  ): RemoveDiscountsCommand {
    const { ids } = options.request;
    return new RemoveDiscountsCommand({
      ids: ids?.map((id) => new DiscountIdValueObject(id)),
    });
  }
  extractResult(result: any): V1RemoveDiscountsHttpResponse {
    return match(result, {
      Ok: (response: RemoveDiscountsResponseDto) =>
        new V1RemoveDiscountsHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }
        throw e;
      },
    });
  }
}
