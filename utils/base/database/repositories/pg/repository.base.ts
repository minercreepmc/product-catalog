import { DatabaseService } from '@config/pg';
import { RepositoryPort } from '@domain-interfaces';
import { ID } from '@base/domain';
import { SchemaMapperBase } from './schema.mapper.base';
import { ReadOnlyRepositoryPort } from '@base/use-cases';
import { PaginationParams } from '@base/use-cases/query-handler';

export interface RepositoryBaseOptions<Domain, Schema> {
  databaseService: DatabaseService;
  mapper: SchemaMapperBase<Domain, Schema>;
}

export interface RawRepositoryBaseOptions {
  databaseService: DatabaseService;
}

export abstract class RepositoryBase<Domain, Schema>
  implements RepositoryPort<Domain>
{
  abstract create(entity: Domain): Promise<Domain>;
  abstract deleteOneById(id: ID): Promise<Domain>;
  abstract findOneById(id: ID): Promise<Domain>;
  abstract updateOneById(id: ID, newState: Domain): Promise<Domain>;

  constructor(options: RepositoryBaseOptions<Domain, Schema>) {
    this.databaseService = options.databaseService;
    this.mapper = options.mapper;
  }
  protected readonly mapper: SchemaMapperBase<Domain, Schema>;
  protected readonly databaseService: DatabaseService;
}

export abstract class ApplicationRepositoryBase<Schema> {
  abstract create(entity: Schema): Promise<Schema>;
  abstract deleteOneById(id: string): Promise<Schema>;
  abstract findOneById(id: string): Promise<Schema>;
  abstract updateOneById(id: string, newState: Schema): Promise<Schema>;

  constructor(options: RawRepositoryBaseOptions) {
    this.databaseService = options.databaseService;
  }

  protected readonly databaseService: DatabaseService;
}

export abstract class ReadonlyRepositoryBase<Schema>
  implements ReadOnlyRepositoryPort<Schema>
{
  abstract findOneById(id: string): Promise<Schema>;
  abstract findAll(filter: PaginationParams): Promise<Schema[]>;

  constructor(options: RawRepositoryBaseOptions) {
    this.databaseService = options.databaseService;
  }

  protected readonly databaseService: DatabaseService;
}