import { ID } from './id.base';

export interface EntityBase {
  id: ID;
}

export interface AggregateRootBase extends EntityBase {}
