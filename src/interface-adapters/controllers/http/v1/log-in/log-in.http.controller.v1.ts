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
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { LogInCommand, LogInResponseDto } from '@use-cases/command/log-in';
import {
  UserNameValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';
import { match } from 'oxide.ts';
import { V1LogInHttpRequest, V1LogInHttpResponse } from './log-in.http.dto.v1';
import { Response as ExpressResponse } from 'express';
import { CommandBus } from '@nestjs/cqrs';

@Controller('/api/v1/log-in')
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
  execute(
    @Body() request: V1LogInHttpRequest,
    @Res() response: ExpressResponse,
  ) {
    return super._execute({
      request,
      response,
    });
  }

  validate(command: LogInCommand): void {
    //
  }

  toCommand({
    request,
  }: HttpControllerBaseOption<V1LogInHttpRequest>): LogInCommand {
    return new LogInCommand({
      username: new UserNameValueObject(request.username),
      password: new UserPasswordValueObject(request.password),
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

    response.setHeader('Cookie', dto.cookie);
    response.json(new V1LogInHttpResponse(dto));
    return new V1LogInHttpResponse(dto);
  }
}
