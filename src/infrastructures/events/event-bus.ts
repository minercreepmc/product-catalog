import { EventBusPort } from '@domain-interfaces/events';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { DomainEvent } from 'common-base-classes';
import { Mediator } from 'nestjs-mediator';

@Injectable()
export class EventBusAdapter implements EventBusPort {
  constructor(
    private readonly mediator: Mediator,
    private readonly entityManager: EntityManager,
  ) {}
  async publish(domainEvent: DomainEvent<any>): Promise<void> {
    return this.mediator.publish(domainEvent);
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
