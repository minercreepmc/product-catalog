import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DatabaseConfigOptions } from './database.config';

export const CONNECTION_POOL = Symbol('CONNECTION_POOL');

export const {
  ConfigurableModuleClass: ConfigurableDatabaseModule,
  MODULE_OPTIONS_TOKEN: DATABASE_OPTIONS,
} = new ConfigurableModuleBuilder<DatabaseConfigOptions>()
  .setClassMethodName('forRoot')
  .build();
