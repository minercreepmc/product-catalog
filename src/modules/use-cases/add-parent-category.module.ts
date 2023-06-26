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
import { ApplicationServicesModule } from './application-services';
import { DomainServicesModule } from '@modules/domains';

const useCase: Provider[] = [
  AddParentCategoriesHandler,
  AddParentCategoriesMapper,
  AddParentCategoriesRequestValidator,
  AddParentCategoriesProcess,
];

const controllers = [V1AddParentCategoriesHttpController];

const sharedModules = [
  MediatorModule,
  DatabaseModule,
  ApplicationServicesModule,
  DomainServicesModule,
];

@Module({
  imports: [...sharedModules],
  controllers,
  providers: [...useCase],
})
export class AddParentCategoryModule {}
