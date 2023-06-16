import { V1AddSubCategoriesHttpController } from '@controllers/http/v1';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
} from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { AddSubCategoriesHandler } from '@use-cases/add-sub-categories';
import {
  AddSubCategoriesMapper,
  AddSubCategoriesProcess,
  AddSubCategoriesValidator,
} from '@use-cases/add-sub-categories/application-services';
import { DatabaseModule } from '@modules/infrastructures/database';
import { MediatorModule } from 'nestjs-mediator';

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

const vendors = [MediatorModule, DatabaseModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...applicationServices],
})
export class AddSubCategoryModule {}
