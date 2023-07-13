import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({
  tableName: 'outbox',
})
export class OutboxModel {
  @PrimaryKey()
  id: number;

  @Property({ type: 'text' })
  eventName: string;

  @Property({ type: 'text' })
  payload: string;
}
