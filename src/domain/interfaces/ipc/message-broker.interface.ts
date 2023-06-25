import { DomainEvent } from 'common-base-classes';
import { Observable } from 'rxjs';

export interface MessageBrokerPort {
  emit(domainEvent: DomainEvent<any>): Observable<any>;
  addToOutboxAndSend(domainEvent: DomainEvent<any>): Promise<any>;
}

//

export const clientProxyDiToken = 'user-message-broker';
export const userMessageBrokerDiToken = Symbol('USER_MESSAGE_BROKER');

export interface UserMessageBrokerPort {
  send(pattern: string, request: any): Observable<any>;
}
