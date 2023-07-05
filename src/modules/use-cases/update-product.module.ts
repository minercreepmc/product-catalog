import { V1UpdateProductHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import {
  UpdateProductHandler,
  UpdateProductMapper,
  UpdateProductProcess,
  UpdateProductRequestValidator,
} from '@use-cases/command/update-product';
import { MediatorModule } from 'nestjs-mediator';
import { DatabaseModule } from '../infrastructures/database';
import { ApplicationServicesModule } from './application-services';

const useCase: Provider[] = [
  UpdateProductHandler,
  UpdateProductMapper,
  UpdateProductRequestValidator,
  UpdateProductProcess,
];

const controllers = [V1UpdateProductHttpController];

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
export class UpdateProductModule {}
