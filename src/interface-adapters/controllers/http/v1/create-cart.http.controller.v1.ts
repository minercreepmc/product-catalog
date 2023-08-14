import {
  v1ApiEndpoints,
  V1CreateCartHttpRequest,
  V1CreateCartHttpResponse,
} from '@api/http';
import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateCartCommand,
  CreateCartResponseDto,
} from '@use-cases/command/create-cart';
import { UserIdValueObject } from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.createCart)
export class V1CreateCartHttpController extends HttpControllerBase<
  V1CreateCartHttpRequest,
  CreateCartCommand,
  V1CreateCartHttpResponse
> {
  @Post()
  async execute(@Body() request: V1CreateCartHttpRequest) {
    return super._execute({
      request,
    });
  }

  toCommand(
    options: HttpControllerBaseOption<V1CreateCartHttpRequest>,
  ): CreateCartCommand {
    const { request } = options;
    const { userId } = request!;
    return new CreateCartCommand({
      userId: new UserIdValueObject(userId),
    });
  }

  extractResult(result: any): V1CreateCartHttpResponse {
    return match(result, {
      Ok: (response: CreateCartResponseDto) =>
        new V1CreateCartHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new UnauthorizedException(e.exceptions);
        }

        throw e;
      },
    });
  }

  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
}
