import { Global, Module } from '@nestjs/common';
import {
  ConfigurableDatabaseModule,
  DATABASE_OPTIONS,
} from './database.module-definition';
import { DatabaseOptions } from './database.options';
import { Pool } from 'pg';
import { PostgresDialect } from 'kysely';
import { KyselyDatabase } from './database';

@Global()
@Module({
  exports: [KyselyDatabase],
  providers: [
    {
      provide: KyselyDatabase,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions) => {
        const dialect = new PostgresDialect({
          pool: new Pool({
            host: databaseOptions.host,
            port: databaseOptions.port,
            user: databaseOptions.user,
            password: databaseOptions.password,
            database: databaseOptions.database,
          }),
        });

        return new KyselyDatabase({
          dialect,
        });
      },
    },
  ],
})
export class KyselyModule extends ConfigurableDatabaseModule {}
