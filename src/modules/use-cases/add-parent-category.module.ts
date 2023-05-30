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
import { AddParentCategoriesHandler } from '@use-cases/add-parent-categories';
import {
  AddParentCategoriesMapper,
  AddParentCategoriesProcess,
  AddParentCategoriesValidator,
} from '@use-cases/add-parent-categories/application-services';

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
  AddParentCategoriesHandler,
  AddParentCategoriesMapper,
  AddParentCategoriesValidator,
  AddParentCategoriesProcess,
];

const vendors = [
  TypeOrmModule.forFeature([CategoryTypeOrmModel, ProductTypeOrmModel]),
  CqrsModule,
];

@Module({
  imports: [...vendors],
  controllers: [],
  providers: [...domainServices, ...repositories, ...applicationServices],
})
export class AddParentCategoryModule {}
