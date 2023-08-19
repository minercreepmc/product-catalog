import {
  v1ApiEndpoints,
  V1CreateCartHttpRequest,
  V1CreateCartHttpResponse,
} from '@api/http';
import { RequestWithUser } from '@api/http/v1/models/user.model.v1';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { Roles } from '@application/application-services/auth/roles';
import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import {
  ConflictException,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateCartCommand,
  CreateCartResponseDto,
} from '@use-cases/command/create-cart';
import { UserIdValueObject, UserRoleEnum } from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.createCart)
export class V1CreateCartHttpController extends HttpControllerBase<
  V1CreateCartHttpRequest,
  CreateCartCommand,
  V1CreateCartHttpResponse
> {
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @Roles(UserRoleEnum.Admin)
  async execute(@Req() req: RequestWithUser) {
    const httpRequest: V1CreateCartHttpRequest = {
      userId: req.user.id,
    };
    return super._execute({
      request: httpRequest,
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
          console.log(e);
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
