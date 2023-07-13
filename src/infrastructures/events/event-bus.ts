import { EventBusPort } from '@domain-interfaces/events';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { DomainEvent } from 'common-base-classes';
import { OutboxModel } from './outbox.model';

@Injectable()
export class EventBusAdapter implements EventBusPort {
  constructor(
    private readonly eventBus: EventBus,
    private readonly entityManager: EntityManager,
  ) {}
  async addToOutBoxAndPublish(domainEvent: DomainEvent<any>): Promise<void> {
    const outboxEntry = this.entityManager.create(OutboxModel, {
      eventName: domainEvent.eventName,
      payload: JSON.stringify(domainEvent),
    });

    await this.entityManager.persistAndFlush(outboxEntry);

    try {
      this.eventBus.publish(domainEvent);

      await this.entityManager.removeAndFlush(outboxEntry);
    } catch (error) {
      console.error(error);
      await this.entityManager.removeAndFlush(outboxEntry);
      throw error;
    }
  }
}
