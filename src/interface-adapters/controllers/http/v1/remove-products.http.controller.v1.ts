import {
  v1ApiEndpoints,
  V1RemoveProductsHttpRequest,
  V1RemoveProductsHttpResponse,
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
  RemoveProductsCommand,
  RemoveProductsResponseDto,
} from '@use-cases/command/remove-products';
import { ProductIdValueObject } from '@value-objects/product';
import { UserRoleEnum } from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.removeProducts)
export class V1RemoveProductsHttpController extends HttpControllerBase<
  V1RemoveProductsHttpRequest,
  RemoveProductsCommand,
  V1RemoveProductsHttpResponse
> {
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(UserRoleEnum.Admin)
  async execute(@Body() request: V1RemoveProductsHttpRequest): Promise<any> {
    return super._execute({ request });
  }

  toCommand({
    request,
  }: HttpControllerBaseOption<V1RemoveProductsHttpRequest>): RemoveProductsCommand {
    const { ids } = request!;

    const command = new RemoveProductsCommand({
      ids: ids?.map((id) => new ProductIdValueObject(id)),
    });
    return command;
  }

  extractResult(result: any): V1RemoveProductsHttpResponse {
    return match(result, {
      Ok: (response: RemoveProductsResponseDto) =>
        new V1RemoveProductsHttpResponse(response),
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
