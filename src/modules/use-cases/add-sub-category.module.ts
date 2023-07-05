import { V1AddSubCategoriesHttpController } from '@controllers/http/v1';
import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from '@modules/infrastructures/database';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';
import { DomainServicesModule } from '@modules/domains';
import {
  AddSubCategoriesHandler,
  AddSubCategoriesMapper,
  AddSubCategoriesProcess,
  AddSubCategoriesRequestValidator,
} from '@use-cases/command/add-sub-categories';

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
