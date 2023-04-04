import { ConfigService } from '@nestjs/config';
import { ProductTypeOrmModel } from '@product-infrastructure/database/repositories/typeorm/product';
import { CreateProductMigration1679747919850 } from '@product-infrastructure/migrations';
import { ReviewerTypeOrmModel } from '@reviewer-infrastructure/database/repositories/typeorm';
import { CreateReviewerMigration1680595085820 } from '@reviewer-infrastructure/migrations/1680595085820-CreateReviewerMigration';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService = new ConfigService();
export const typeOrmDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [ProductTypeOrmModel, ReviewerTypeOrmModel],
  migrations: [
    CreateProductMigration1679747919850,
    CreateReviewerMigration1680595085820,
  ],
  //synchronize: true,
};
export const typeormDataSource = new DataSource(typeOrmDataSourceOptions);
