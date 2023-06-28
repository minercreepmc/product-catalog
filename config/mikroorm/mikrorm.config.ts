import { CategoryMikroOrmModel } from '@database/repositories/mikroorm/category';
import { ProductMikroOrmModel } from '@database/repositories/mikroorm/product';
import { ReviewerMikroOrmModel } from '@database/repositories/mikroorm/reviewer';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const mikroOrmConfig: MikroOrmModuleSyncOptions = {
  type: 'postgresql',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  user: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  dbName: configService.get('POSTGRES_DB'),
  autoLoadEntities: true,
  entities: [
    ProductMikroOrmModel,
    ReviewerMikroOrmModel,
    CategoryMikroOrmModel,
  ],
  migrations: {
    path: './src/infrastructures/database/migrations',
  },
  allowGlobalContext: true,
};

export default mikroOrmConfig;
