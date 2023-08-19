import {
  v1ApiEndpoints,
  V1RegisterAdminHttpRequest,
  V1RegisterAdminHttpResponse,
} from '@api/http';
import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import {
  RegisterAdminCommand,
  RegisterAdminResponseDto,
} from '@use-cases/command/register-admin';
import {
  UserFullNameValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.registerAdmin)
export class V1RegisterAdminHttpController extends HttpControllerBase<
  V1RegisterAdminHttpRequest,
  RegisterAdminCommand,
  V1RegisterAdminHttpResponse
> {
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }

  @Post()
  @UseGuards(AuthGuard('api-key'))
  execute(@Body() request: V1RegisterAdminHttpRequest) {
    return super._execute({
      request,
    });
  }

  toCommand({
    request,
  }: HttpControllerBaseOption<V1RegisterAdminHttpRequest>): RegisterAdminCommand {
    const { username, password, fullName } = request!;
    return new RegisterAdminCommand({
      username: new UserNameValueObject(username),
      password: new UserPasswordValueObject(password),
      fullName: new UserFullNameValueObject(fullName),
    });
  }
  extractResult(result: any): V1RegisterAdminHttpResponse {
    return match(result, {
      Ok: (dto: RegisterAdminResponseDto) =>
        new V1RegisterAdminHttpResponse(dto),
      Err: (e) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }
        throw e;
      },
    });
  }
}
