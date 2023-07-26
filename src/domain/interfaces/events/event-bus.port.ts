import { DomainEventBase } from '@base/domain';

export const eventBusDiToken = Symbol('EVENT_BUS');

export interface EventBusPort {
  publish(event: DomainEventBase): void;
}
