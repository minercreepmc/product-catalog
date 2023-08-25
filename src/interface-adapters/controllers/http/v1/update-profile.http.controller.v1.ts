import {
  RequestWithUser,
  v1ApiEndpoints,
  V1UpdateProfileHttpRequest,
  V1UpdateProfileHttpResponse,
} from '@api/http';
import {
  JwtAuthenticationGuard,
  LocalAuthenticationGuard,
} from '@application/application-services/auth';
import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import {
  Body,
  ConflictException,
  Controller,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  UpdateProfileCommand,
  UpdateProfileResponseDto,
} from '@use-cases/command/update-profile';
import {
  UserAddressValueObject,
  UserFullNameValueObject,
  UserIdValueObject,
} from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.updateProfile)
@UseGuards(JwtAuthenticationGuard)
export class V1UpdateProfileHttpController extends HttpControllerBase<
  V1UpdateProfileHttpRequest,
  UpdateProfileCommand,
  V1UpdateProfileHttpResponse
> {
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }

  @Put()
  execute(
    @Param('id') id: string,
    @Body() request: V1UpdateProfileHttpRequest,
    @Req() { user }: RequestWithUser,
  ) {
    return super._execute({
      user,
      request,
      param: id,
    });
  }

  toCommand(
    options: HttpControllerBaseOption<V1UpdateProfileHttpRequest>,
  ): UpdateProfileCommand {
    const { param, request } = options;
    const { fullName, address } = request!;
    return new UpdateProfileCommand({
      id: new UserIdValueObject(param!),
      fullName: fullName ? new UserFullNameValueObject(fullName) : undefined,
      address: address ? new UserAddressValueObject(address) : undefined,
    });
  }
  extractResult(result: any): V1UpdateProfileHttpResponse {
    return match(result, {
      Ok: (response: UpdateProfileResponseDto) =>
        new V1UpdateProfileHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }

        throw e;
      },
    });
  }
}
