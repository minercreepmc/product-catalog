import { DomainEventBase } from '@base/domain';
import { EventBusPort } from '@domain-interfaces/events';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class EventBusAdapter implements EventBusPort {
  constructor(private readonly eventBus: EventBus) {}
  async publish(domainEvent: DomainEventBase): Promise<void> {
    return this.eventBus.publish(domainEvent);
  }

  // async addToOutBoxAndPublish(domainEvent: DomainEvent<any>): Promise<void> {
  //   const outboxEntry = em.create(OutboxModel, {
  //     eventName: domainEvent.eventName,
  //     payload: JSON.stringify(domainEvent),
  //   });
  //
  //   await em.persistAndFlush(outboxEntry);
  //
  //   try {
  //     this.mediator.publish(domainEvent);
  //
  //     em.remove(outboxEntry);
  //   } catch (error) {
  //     console.log('catch', error);
  //     em.remove(outboxEntry);
  //     throw error;
  //   }
  //}
}
