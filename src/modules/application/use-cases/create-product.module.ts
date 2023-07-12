import { V1CreateProductHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { DatabaseModule } from '@modules/infrastructures/database';
import { Module, Provider } from '@nestjs/common';
import {
  CreateProductHandler,
  CreateProductMapper,
  CreateProductProcess,
  CreateProductRequestValidator,
} from '@use-cases/command/create-product';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';

const useCase: Provider[] = [
  CreateProductHandler,
  CreateProductMapper,
  CreateProductRequestValidator,
  CreateProductProcess,
];

const controllers = [V1CreateProductHttpController];
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
export class CreateProductModule {}
