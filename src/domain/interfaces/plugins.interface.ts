import { ID, QueryParams } from 'common-base-classes';

export interface FindOne<Entity, EntityDetails> {
  findOne(params: QueryParams<EntityDetails>): Promise<Entity | undefined>;
}
export interface FindOneById<Entity> {
  findOneById(id: ID): Promise<Entity | undefined>;
}
export interface Save<Entity> {
  save(entity: Entity): Promise<Entity>;
}
export interface SaveMany<Entity> {
  saveMany(entities: Entity[]): Promise<Entity[]>;
}
export interface Delete<EntityDetails> {
  delete(params: QueryParams<EntityDetails>): Promise<boolean>;
}
export interface Update<Entity, EntityDetails> {
  update(params: QueryParams<EntityDetails>, newState: Entity): Promise<Entity>;
}
export interface Transaction {
  runInTransaction<T>(fn: () => Promise<T>): Promise<T>;
}
