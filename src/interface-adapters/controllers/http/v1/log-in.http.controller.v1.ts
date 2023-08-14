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
import { LogInCommand, LogInResponseDto } from '@use-cases/command/log-in';
import {
  UserNameValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';
import { match } from 'oxide.ts';
import { Response as ExpressResponse } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import {
  v1ApiEndpoints,
  V1LogInHttpRequest,
  V1LogInHttpResponse,
} from '@api/http';
import { LocalAuthenticationGuard } from '@application/application-services/auth';
import { RequestWithUser } from '@api/http/v1/models/user.model.v1';

@Controller(v1ApiEndpoints.logIn)
export class V1LogInHttpController extends HttpControllerBase<
  V1LogInHttpRequest,
  LogInCommand,
  V1LogInHttpResponse
> {
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  execute(@Res() response: ExpressResponse, @Req() request: RequestWithUser) {
    const body = request.user;
    console.log(body);
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
  }: HttpControllerBaseOption<V1LogInHttpRequest>): LogInCommand {
    const { username } = request!;
    return new LogInCommand({
      username: new UserNameValueObject(username),
    });
  }
  extractResult(
    result: any,
    { response }: HttpControllerBaseOption<V1LogInHttpRequest>,
  ): V1LogInHttpResponse {
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
    response!.json(new V1LogInHttpResponse(dto));
    return new V1LogInHttpResponse(dto);
  }
}
