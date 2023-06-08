import { V1CreateCategoryHttpController } from '@controllers/http/v1';
import {
  CategoryTypeOrmModel,
  CategoryTypeOrmRepository,
} from '@database/repositories/typeorm/category';
import {
  ProductTypeOrmModel,
  ProductTypeOrmRepository,
} from '@database/repositories/typeorm/product';
import {
  categoryRepositoryDiToken,
  productRepositoryDiToken,
} from '@domain-interfaces';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  ProductManagementDomainService,
} from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCategoryHandler } from '@use-cases/create-category';
import {
  CreateCategoryMapper,
  CreateCategoryProcess,
  CreateCategoryValidator,
} from '@use-cases/create-category/application-services';

const repositories: Provider[] = [
  {
    provide: categoryRepositoryDiToken,
    useClass: CategoryTypeOrmRepository,
  },
  {
    provide: productRepositoryDiToken,
    useClass: ProductTypeOrmRepository,
  },
];

const domainServices: Provider[] = [
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  ProductManagementDomainService,
];

const applicationServices: Provider[] = [
  CreateCategoryHandler,
  CreateCategoryValidator,
  CreateCategoryProcess,
  CreateCategoryMapper,
];

const controllers = [V1CreateCategoryHttpController];

const vendors = [
  TypeOrmModule.forFeature([ProductTypeOrmModel, CategoryTypeOrmModel]),
  CqrsModule,
];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...repositories, ...applicationServices],
})
export class CreateCategoryModule {}
