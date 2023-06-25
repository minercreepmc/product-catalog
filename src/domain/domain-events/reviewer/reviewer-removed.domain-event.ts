import { ReviewerAggregate } from '@aggregates/reviewer';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { DomainEvent } from 'common-base-classes';

export interface ReviewerRemovedDomainEventOptions {
  id: ReviewerIdValueObject;
}

export class ReviewerRemovedDomainEvent extends DomainEvent<any> {
  constructor(options: ReviewerRemovedDomainEventOptions) {
    super({
      entityId: options.id,
      eventName: ReviewerRemovedDomainEvent.name,
      entityType: ReviewerAggregate.name,
      eventDetails: {},
    });
  }

  get id() {
    return this.entityId;
  }
}
