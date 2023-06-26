import { V1CreateProductHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CreateProductHandler } from '@use-cases/create-product';
import {
  CreateProductMapper,
  CreateProductProcess,
  CreateProductRequestValidator,
} from '@use-cases/create-product/application-services';
import { MediatorModule } from 'nestjs-mediator';
import { DatabaseModule } from '../infrastructures/database';
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
