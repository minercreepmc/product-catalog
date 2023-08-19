import {
  RequestWithUser,
  v1ApiEndpoints,
  V1LogInAdminHttpRequest,
  V1LogInAdminHttpResponse,
} from '@api/http';
import { LocalAuthenticationGuard } from '@application/application-services/auth';
import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LogInCommand, LogInResponseDto } from '@use-cases/command/log-in';
import { UserNameValueObject } from '@value-objects/user';
import { match } from 'oxide.ts';
import { Response as ExpressResponse } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller(v1ApiEndpoints.logInAdmin)
export class V1LogInAdminController extends HttpControllerBase<
  V1LogInAdminHttpRequest,
  LogInCommand,
  V1LogInAdminHttpResponse
> {
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  execute(@Req() request: RequestWithUser, @Res() response: ExpressResponse) {
    const body = request.user;
    return super._execute({
      request: body,
      response,
    });
  }

  validate(command: LogInCommand): void {
    //
  }

  toCommand({
    request,
  }: HttpControllerBaseOption<V1LogInAdminHttpRequest>): LogInCommand {
    const { username } = request!;
    return new LogInCommand({
      username: new UserNameValueObject(username),
    });
  }
  extractResult(
    result: any,
    { response }: HttpControllerBaseOption<V1LogInAdminHttpRequest>,
  ): V1LogInAdminHttpResponse {
    const dto = match(result, {
      Ok: (dto: LogInResponseDto) => dto,
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new UnauthorizedException(e.exceptions);
        }

        throw e;
      },
    });

    response!.setHeader('Set-Cookie', dto.cookie);
    response!.json(new V1LogInAdminHttpResponse(dto));
    return new V1LogInAdminHttpResponse(dto);
  }
}
