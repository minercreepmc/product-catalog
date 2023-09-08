import {
  v1ApiEndpoints,
  V1RemoveCategoryHttpRequest,
  V1RemoveCategoryHttpResponse,
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
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  RemoveCategoryCommand,
  RemoveCategoryResponseDto,
} from '@use-cases/command/remove-category';
import { CategoryIdValueObject } from '@value-objects/category';
import { UserRoleEnum } from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.removeCategory)
export class V1RemoveCategoryHttpController extends HttpControllerBase<
  V1RemoveCategoryHttpRequest,
  RemoveCategoryCommand,
  V1RemoveCategoryHttpResponse
> {
  toCommand(
    options: HttpControllerBaseOption<V1RemoveCategoryHttpRequest>,
  ): RemoveCategoryCommand {
    const { param } = options;
    return new RemoveCategoryCommand({
      id: new CategoryIdValueObject(param),
    });
  }
  extractResult(result: any): V1RemoveCategoryHttpResponse {
    return match(result, {
      Ok: (response: RemoveCategoryResponseDto) =>
        new V1RemoveCategoryHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }

        throw e;
      },
    });
  }
  @Delete()
  @UseGuards(JwtAuthenticationGuard)
  @Roles(UserRoleEnum.Admin)
  async execute(
    @Body() request: V1RemoveCategoryHttpRequest,
    @Param('id') id: string,
  ): Promise<any> {
    return super._execute({
      request,
      param: id,
    });
  }

  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
}
