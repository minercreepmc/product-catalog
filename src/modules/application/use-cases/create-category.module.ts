import { V1CreateCategoryHttpController } from '@controllers/http/v1';
import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from '@modules/infrastructures/database';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';
import { DomainServicesModule } from '@modules/domains';
import {
  CreateCategoryHandler,
  CreateCategoryMapper,
  CreateCategoryProcess,
  CreateCategoryRequestValidator,
} from '@use-cases/command/create-category';

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
