import { ConfigService } from '@nestjs/config';
import { ProductTypeOrmModel } from '@product-infrastructure/database/repositories/typeorm/product';
import { CreateProductMigration1679747919850 } from '@product-infrastructure/migrations';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService = new ConfigService();
export const typeOrmDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [ProductTypeOrmModel],
  migrations: [CreateProductMigration1679747919850],
  //synchronize: true,
};
export const typeormDataSource = new DataSource(typeOrmDataSourceOptions);
