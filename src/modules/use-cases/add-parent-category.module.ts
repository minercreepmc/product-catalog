import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
} from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AddParentCategoriesHandler } from '@use-cases/add-parent-categories';
import {
  AddParentCategoriesMapper,
  AddParentCategoriesProcess,
  AddParentCategoriesValidator,
} from '@use-cases/add-parent-categories/application-services';
import { DatabaseModule } from '@modules/infrastructures/database';

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

const vendors = [CqrsModule, DatabaseModule];

@Module({
  imports: [...vendors],
  controllers: [],
  providers: [...domainServices, ...applicationServices],
})
export class AddParentCategoryModule {}
