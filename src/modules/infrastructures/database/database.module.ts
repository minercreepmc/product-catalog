import { readOnlyProductRepositoryDiToken } from '@application/interface/product';
import { userRepositoryDiToken } from '@application/interface/user';
import { UnitOfWork } from '@base/database/unit-of-work';
import {
  ConfigurableDatabaseModule,
  CONNECTION_POOL,
  DatabaseConfigOptions,
  DatabaseService,
  DATABASE_OPTIONS,
} from '@config/pg';
import {
  ProductRepository,
  ProductSchemaMapper,
  ReadOnlyProductRepository,
} from '@database/repositories/pg/product';
import { UserRepository } from '@database/repositories/pg/user';
import { productRepositoryDiToken } from '@domain-interfaces';
import { unitOfWorkDiToken } from '@domain-interfaces';
import { Global, Module, Provider } from '@nestjs/common';
import { Pool } from 'pg';

const repositories: Provider[] = [
  {
    provide: productRepositoryDiToken,
    useClass: ProductRepository,
  },
  {
    provide: userRepositoryDiToken,
    useClass: UserRepository,
  },
  {
    provide: readOnlyProductRepositoryDiToken,
    useClass: ReadOnlyProductRepository,
  },
  {
    provide: unitOfWorkDiToken,
    useClass: UnitOfWork,
  },
];

const poolProvider: Provider = {
  provide: CONNECTION_POOL,
  inject: [DATABASE_OPTIONS],
  useFactory: (databaseOptions: DatabaseConfigOptions) => {
    return new Pool({
      host: databaseOptions.host,
      port: databaseOptions.port,
      user: databaseOptions.user,
      password: databaseOptions.password,
      database: databaseOptions.database,
    });
  },
};

const mappers: Provider[] = [ProductSchemaMapper];

@Global()
@Module({
  imports: [],
  providers: [...repositories, DatabaseService, poolProvider, ...mappers],
  exports: [...repositories, DatabaseService],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
