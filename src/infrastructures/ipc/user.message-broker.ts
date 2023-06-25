import { clientProxyDiToken, UserMessageBrokerPort } from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Observable } from 'rxjs';
import { UserMessagerBrokerMapper } from './user.message-broker.mapper';
import { Services } from '@shared/microservices/services';

@Injectable()
export class UserMessageBroker implements UserMessageBrokerPort {
  constructor(
    @Inject(clientProxyDiToken)
    private readonly clientProxy: ClientProxy,
  ) {}

  send(pattern: string, request: any): Observable<any> {
    const mapper = new UserMessagerBrokerMapper(
      Services.USER_MANAGEMENT.toString(),
    );
    const message = mapper.mapToMessage(request);
    return this.clientProxy.send(pattern, message);
  }
}
