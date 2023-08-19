import {
  v1ApiEndpoints,
  V1RemoveCategoriesHttpRequest,
  V1RemoveCategoriesHttpResponse,
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
  RemoveCategoriesCommand,
  RemoveCategoriesResponseDto,
} from '@use-cases/command/remove-categories';
import { CategoryIdValueObject } from '@value-objects/category';
import { UserRoleEnum } from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.removeCategories)
export class V1RemoveCategoriesHttpController extends HttpControllerBase<
  V1RemoveCategoriesHttpRequest,
  RemoveCategoriesCommand,
  V1RemoveCategoriesHttpResponse
> {
  toCommand(
    options: HttpControllerBaseOption<V1RemoveCategoriesHttpRequest>,
  ): RemoveCategoriesCommand {
    const { request } = options;
    const { ids } = request!;
    return new RemoveCategoriesCommand({
      ids: ids && ids.map((id) => new CategoryIdValueObject(id)),
    });
  }
  extractResult(result: any): V1RemoveCategoriesHttpResponse {
    return match(result, {
      Ok: (response: RemoveCategoriesResponseDto) =>
        new V1RemoveCategoriesHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }

        throw e;
      },
    });
  }
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthenticationGuard)
  @Roles(UserRoleEnum.Admin)
  async execute(@Body() request: V1RemoveCategoriesHttpRequest): Promise<any> {
    return super._execute({
      request,
    });
  }

  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
}
