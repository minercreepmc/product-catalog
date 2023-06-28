import {
  userMessageBrokerDiToken,
  UserMessageBrokerPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HandlerExceptions } from './dtos/handler.exceptions';
import {
  V1RegisterMemberRequestDto,
  V1RegisterMemberResponseDto,
  V1UserInterface,
} from './handlers';
import { V1UserPattern } from './handlers/user.interface';

@Injectable()
export class UserProxy implements V1UserInterface {
  constructor(
    @Inject(userMessageBrokerDiToken)
    private readonly userMessageBroker: UserMessageBrokerPort,
  ) {}

  async registerMember(
    request: V1RegisterMemberRequestDto,
  ): Promise<V1RegisterMemberResponseDto> {
    try {
      return await lastValueFrom(
        this.userMessageBroker.send(
          V1UserPattern.REGISTER_MEMBER.toString(),
          request,
        ),
      );
    } catch (exceptions) {
      throw new HandlerExceptions(exceptions);
    }
  }
}
