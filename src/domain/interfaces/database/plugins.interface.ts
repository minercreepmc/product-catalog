import { EntityBase, ID } from '@base/domain';
import { PaginationParams } from '@base/use-cases/query-handler';

export type Query<Details> = Partial<EntityBase & Details>;

export interface FindOneById<Entity> {
  findOneById(id: ID): Promise<Entity | null>;
}
export interface Create<Entity> {
  create(entity: Entity): Promise<Entity | null>;
}
export interface SaveMany<Entity> {
  saveMany(entities: Entity[]): Promise<Entity[]>;
}

export interface DeleteOneById<Entity> {
  deleteOneById(id: any): Promise<Entity | null>;
}

export interface UpdateOneById<Entity> {
  updateOneById(id: any, newState: Entity): Promise<Entity | null>;
}
export interface Transaction {
  runInTransaction<T>(fn: () => Promise<T>): Promise<T>;
}

export interface FindMany<Entity> {
  findMany(options?: Entity & PaginationParams): Promise<Entity[] | null>;
}

export interface DeleteManyByIds<Entity> {
  deleteManyByIds(ids: ID[]): Promise<Entity[] | null>;
}
