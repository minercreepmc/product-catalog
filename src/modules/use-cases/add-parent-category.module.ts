import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
} from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { AddParentCategoriesHandler } from '@use-cases/add-parent-categories';
import {
  AddParentCategoriesMapper,
  AddParentCategoriesProcess,
  AddParentCategoriesRequestValidator,
} from '@use-cases/add-parent-categories/application-services';
import { DatabaseModule } from '@modules/infrastructures/database';
import { V1AddParentCategoriesHttpController } from '@controllers/http/v1/add-parent-categories';
import { MediatorModule } from 'nestjs-mediator';

const domainServices: Provider[] = [
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
];

const applicationServices: Provider[] = [
  AddParentCategoriesHandler,
  AddParentCategoriesMapper,
  AddParentCategoriesRequestValidator,
  AddParentCategoriesProcess,
];

const controllers = [V1AddParentCategoriesHttpController];

const vendors = [MediatorModule, DatabaseModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...applicationServices],
})
export class AddParentCategoryModule {}
