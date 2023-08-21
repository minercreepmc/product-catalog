import {
  v1ApiEndpoints,
  V1RemoveDiscountsHttpRequest,
  V1RemoveDiscountsHttpResponse,
} from '@api/http';
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
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  RemoveDiscountsCommand,
  RemoveDiscountsResponseDto,
} from '@use-cases/command/remove-discounts';
import { DiscountIdValueObject } from '@value-objects/discount';
import { UserRoleEnum } from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.removeDiscounts)
@UseGuards(JwtAuthenticationGuard)
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
  @Roles(UserRoleEnum.Admin)
  execute(@Body() request: V1RemoveDiscountsHttpRequest) {
    return super._execute({
      request,
    });
  }

  toCommand(
    options: HttpControllerBaseOption<V1RemoveDiscountsHttpRequest>,
  ): RemoveDiscountsCommand {
    const { ids } = options.request!;
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
