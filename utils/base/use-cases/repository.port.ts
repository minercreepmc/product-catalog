import { PaginationParams } from './query-handler';

export interface ApplicationRepositoryPort<Schema> {
  create(entity: Schema): Promise<Schema>;
  deleteOneById(id: string): Promise<Schema>;
  findOneById(id: string): Promise<Schema>;
  updateOneById(id: string, newState: Schema): Promise<Schema>;
}

export interface ReadOnlyRepositoryPort<Schema> {
  findOneById(name: string): Promise<Schema>;
  findAll(filter: PaginationParams): Promise<Schema[]>;
}
