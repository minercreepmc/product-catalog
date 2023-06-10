import { IBaseEntity } from 'common-base-classes';
import { FindOptionsWhere } from 'typeorm';
import { MikroOrmModelBase } from './mikroorm-model.base';

export type EntityConstructor<Entity> = new (...props: any) => Entity;

export type EventConstructorDocuments<
  DomainEventName extends string,
  DomainEventClass,
> = Record<DomainEventName, DomainEventClass>;

export type QueryParams<EntityDetails> = Partial<IBaseEntity & EntityDetails>;

export type WhereClause<OrmModel> =
  | FindOptionsWhere<OrmModel>
  | FindOptionsWhere<OrmModel>[];

export type OrmModelDetails<OrmModel> = Omit<
  OrmModel,
  'id' | 'createdAt' | 'updatedAt'
>;

export type MikroOrmModelDetails = OrmModelDetails<MikroOrmModelBase>;

export type MikroOrmModelConstructor<OrmModel> = new (
  ...props: any
) => OrmModel;
