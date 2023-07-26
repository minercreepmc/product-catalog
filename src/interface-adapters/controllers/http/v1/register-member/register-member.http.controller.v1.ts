import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  RegisterMemberCommand,
  RegisterMemberResponseDto,
} from '@use-cases/command/register-member';
import {
  UserNameValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';
import { match } from 'oxide.ts';
import {
  V1RegisterMemberHttpRequest,
  V1RegisterMemberHttpResponse,
} from './register-member.http.dto.v1';

@Controller('/api/v1/register')
export class V1RegisterMemberHttpController extends HttpControllerBase<
  V1RegisterMemberHttpRequest,
  RegisterMemberCommand,
  V1RegisterMemberHttpResponse
> {
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }

  @Post()
  execute(@Body() request: V1RegisterMemberHttpRequest) {
    return super._execute({
      request,
    });
  }

  toCommand({
    request,
  }: HttpControllerBaseOption<V1RegisterMemberHttpRequest>): RegisterMemberCommand {
    return new RegisterMemberCommand({
      username: new UserNameValueObject(request.username),
      password: new UserPasswordValueObject(request.password),
    });
  }
  extractResult(result: any): V1RegisterMemberHttpResponse {
    return match(result, {
      Ok: (dto: RegisterMemberResponseDto) =>
        new V1RegisterMemberHttpResponse(dto),
      Err: (e) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }
        throw e;
      },
    });
  }
}
