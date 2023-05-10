import { CategoryTypeOrmModel } from '@database/repositories/typeorm/category';
import { ProductTypeOrmModel } from '@database/repositories/typeorm/product';
import { ReviewerTypeOrmModel } from '@database/repositories/typeorm/reviewer';
import {
  CreateProductMigration1679747919850,
  CreateReviewerMigration1680595085820,
  AddReviewerRole1680930138166,
  CreateCategory1683716855518,
} from '@migrations';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService = new ConfigService();
export const typeOrmDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [ProductTypeOrmModel, ReviewerTypeOrmModel, CategoryTypeOrmModel],
  migrations: [
    CreateProductMigration1679747919850,
    CreateReviewerMigration1680595085820,
    AddReviewerRole1680930138166,
    CreateCategory1683716855518,
  ],
  //synchronize: true,
};
export const typeormDataSource = new DataSource(typeOrmDataSourceOptions);
