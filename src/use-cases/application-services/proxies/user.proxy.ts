import {
  userMessageBrokerDiToken,
  UserMessageBrokerPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import {
  HandlerExceptions,
  V1RegisterMemberRequestDto,
  V1RegisterMemberResponseDto,
  V1UserServiceInterface,
} from '@shared/gateways';
import { V1UserPattern } from '@shared/patterns';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserProxy implements V1UserServiceInterface {
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
          V1UserPattern.CREATE_MEMBER.toString(),
          request,
        ),
      );
    } catch (exceptions) {
      throw new HandlerExceptions(exceptions);
    }
  }
}
