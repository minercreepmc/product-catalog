export class DomainEventBase {
  entityType: string;
  eventName: string;
  occuredAt: Date;

  constructor(options: Omit<DomainEventBase, 'occuredAt'>) {
    this.entityType = options.entityType;
    this.eventName = options.eventName;
    this.occuredAt = new Date(Date.now());
  }
}
