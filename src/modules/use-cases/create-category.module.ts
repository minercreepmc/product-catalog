import { V1CreateCategoryHttpController } from '@controllers/http/v1';
import { Module, Provider } from '@nestjs/common';
import { CreateCategoryHandler } from '@use-cases/create-category';
import {
  CreateCategoryMapper,
  CreateCategoryProcess,
  CreateCategoryRequestValidator,
} from '@use-cases/create-category/application-services';
import { DatabaseModule } from '@modules/infrastructures/database';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';
import { DomainServicesModule } from '@modules/domains';

const useCase: Provider[] = [
  CreateCategoryHandler,
  CreateCategoryRequestValidator,
  CreateCategoryProcess,
  CreateCategoryMapper,
];

const controllers = [V1CreateCategoryHttpController];
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
export class CreateCategoryModule {}
