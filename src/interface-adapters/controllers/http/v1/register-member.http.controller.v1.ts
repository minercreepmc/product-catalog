import {
  v1ApiEndpoints,
  V1RegisterMemberHttpRequest,
  V1RegisterMemberHttpResponse,
} from '@api/http';
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
  UserFullNameValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.registerMember)
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
    const { username, password, fullName } = request!;
    console.log(request);
    return new RegisterMemberCommand({
      username: new UserNameValueObject(username),
      password: new UserPasswordValueObject(password),
      fullName: new UserFullNameValueObject(fullName),
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
