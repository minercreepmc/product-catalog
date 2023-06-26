import { V1AddSubCategoriesHttpController } from '@controllers/http/v1';
import { Module, Provider } from '@nestjs/common';
import { AddSubCategoriesHandler } from '@use-cases/add-sub-categories';
import {
  AddSubCategoriesMapper,
  AddSubCategoriesProcess,
  AddSubCategoriesRequestValidator,
} from '@use-cases/add-sub-categories/application-services';
import { DatabaseModule } from '@modules/infrastructures/database';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';
import { DomainServicesModule } from '@modules/domains';

const useCase: Provider[] = [
  AddSubCategoriesHandler,
  AddSubCategoriesMapper,
  AddSubCategoriesRequestValidator,
  AddSubCategoriesProcess,
];

const controllers = [V1AddSubCategoriesHttpController];

const sharedModules = [
  MediatorModule,
  DatabaseModule,
  DomainServicesModule,
  ApplicationServicesModule,
];

@Module({
  imports: [...sharedModules],
  controllers,
  providers: [...useCase],
})
export class AddSubCategoryModule {}
