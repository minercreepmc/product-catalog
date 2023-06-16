import { DomainEvent } from 'common-base-classes';
import { Observable } from 'rxjs';

export const clientProxyDiToken = Symbol('CLIENT_PROXY');
export const messageBrokerDiToken = Symbol('MESSAGE_BROKER');

export interface MessageBrokerPort {
  emit(domainEvent: DomainEvent<any>): Observable<any>;
  addToOutboxAndSend(domainEvent: DomainEvent<any>): Promise<any>;
}
