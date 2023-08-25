import { PaginationParams } from './query-handler';

export interface ApplicationRepositoryPort<Schema> {
  create(entity: Schema): Promise<Schema | null>;
  deleteOneById(id: string): Promise<Schema | null>;
  findOneById(id: string): Promise<Schema | null>;
  updateOneById(id: string, newState: Partial<Schema>): Promise<Schema | null>;
}

export interface ReadOnlyRepositoryPort<Schema> {
  findOneById(id: string): Promise<Schema | null>;
  findAll(filter: PaginationParams): Promise<Schema[] | null>;
}
