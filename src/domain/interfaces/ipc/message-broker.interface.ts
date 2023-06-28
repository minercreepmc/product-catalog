import { DomainEvent } from 'common-base-classes';
import { Observable } from 'rxjs';

export interface MessageBrokerPort {
  emit(domainEvent: DomainEvent<any>): Observable<any>;
  //addToOutboxAndSend(domainEvent: DomainEvent<any>): Promise<any>;
}

//

export const userClientProxy = 'user-message-broker';
export const productClientProxy = 'product-message-broker';

export const userMessageBrokerDiToken = Symbol('USER_MESSAGE_BROKER');
export const productMessageBrokerDiToken = Symbol('PRODUCT_MESSAGE_BROKER');

export interface UserMessageBrokerPort {
  send(pattern: string, request: any): Observable<any>;
}

export interface ProductMessageBrokerPort {
  send(pattern: string, request: any): Observable<any>;
}
