import { V1AddSubCategoriesHttpController } from '@controllers/http/v1';
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
} from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddSubCategoriesHandler } from '@use-cases/add-sub-categories';
import {
  AddSubCategoriesMapper,
  AddSubCategoriesProcess,
  AddSubCategoriesValidator,
} from '@use-cases/add-sub-categories/application-services';

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
];

const applicationServices: Provider[] = [
  AddSubCategoriesHandler,
  AddSubCategoriesMapper,
  AddSubCategoriesValidator,
  AddSubCategoriesProcess,
];

const controllers = [V1AddSubCategoriesHttpController];

const vendors = [
  TypeOrmModule.forFeature([CategoryTypeOrmModel, ProductTypeOrmModel]),
  CqrsModule,
];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...applicationServices, ...repositories],
})
export class AddSubCategoryModule {}
