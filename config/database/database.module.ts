import { Global, Module, Provider } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseConfigOptions } from './database.config';
import {
  ConfigurableDatabaseModule,
  CONNECTION_POOL,
  DATABASE_OPTIONS,
} from './database.module-definition';
import { DatabaseService } from './database.service';

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

@Global()
@Module({
  imports: [],
  providers: [DatabaseService, poolProvider],
  exports: [DatabaseService],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
