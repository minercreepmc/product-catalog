import { EventBusPort } from '@domain-interfaces/events';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { DomainEvent } from 'common-base-classes';

@Injectable()
export class EventBusAdapter implements EventBusPort {
  constructor(private readonly eventBus: EventBus) {}
  publish(event: DomainEvent<any>): void {
    this.eventBus.publish(event);
  }
}
