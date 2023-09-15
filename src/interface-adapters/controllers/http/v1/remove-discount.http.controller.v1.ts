import {
  v1ApiEndpoints,
  V1RemoveDiscountHttpRequest,
  V1RemoveDiscountHttpResponse,
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
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  RemoveDiscountCommand,
  RemoveDiscountResponseDto,
} from '@use-cases/command/remove-discount';
import { DiscountIdValueObject } from '@value-objects/discount';
import { UserRoleEnum } from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.removeDiscount)
@UseGuards(JwtAuthenticationGuard)
export class V1RemoveDiscountHttpController extends HttpControllerBase<
  V1RemoveDiscountHttpRequest,
  RemoveDiscountCommand,
  V1RemoveDiscountHttpResponse
> {
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
  @Post()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoleEnum.Admin)
  execute(
    @Body() request: V1RemoveDiscountHttpRequest,
    @Param('id') id: string,
  ) {
    return super._execute({
      request,
      param: id,
    });
  }

  toCommand({
    param,
  }: HttpControllerBaseOption<V1RemoveDiscountHttpRequest>): RemoveDiscountCommand {
    return new RemoveDiscountCommand({
      id: new DiscountIdValueObject(param),
    });
  }
  extractResult(result: any): V1RemoveDiscountHttpResponse {
    return match(result, {
      Ok: (response: RemoveDiscountResponseDto) =>
        new V1RemoveDiscountHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }
        throw e;
      },
    });
  }
}
