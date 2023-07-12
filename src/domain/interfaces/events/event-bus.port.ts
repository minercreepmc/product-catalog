import { DomainEvent } from 'common-base-classes';

export const eventBusDiToken = Symbol('EVENT_BUS');

export interface EventBusPort {
  publish(event: DomainEvent<any>): void;
}
