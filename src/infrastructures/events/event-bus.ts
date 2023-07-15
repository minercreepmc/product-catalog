import { EventBusPort } from '@domain-interfaces/events';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { DomainEvent } from 'common-base-classes';
import { Mediator } from 'nestjs-mediator';
import { OutboxModel } from './outbox.model';

@Injectable()
export class EventBusAdapter implements EventBusPort {
  constructor(
    private readonly mediator: Mediator,
    private readonly entityManager: EntityManager,
  ) {}
  async addToOutBoxAndPublish(domainEvent: DomainEvent<any>): Promise<void> {
    const outboxEntry = this.entityManager.create(OutboxModel, {
      eventName: domainEvent.eventName,
      payload: JSON.stringify(domainEvent),
    });

    await this.entityManager.persistAndFlush(outboxEntry);

    try {
      this.mediator.publish(domainEvent);

      await this.entityManager.removeAndFlush(outboxEntry);
    } catch (error) {
      console.error(error);
      await this.entityManager.removeAndFlush(outboxEntry);
      throw error;
    }
  }
}
