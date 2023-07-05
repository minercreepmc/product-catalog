import { V1ApproveProductHttpController } from '@controllers/http/v1';
import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from '@modules/infrastructures/database';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';
import { DomainServicesModule } from '@modules/domains';
import {
  ApproveProductHandler,
  ApproveProductMapper,
  ApproveProductProcess,
  ApproveProductRequestValidator,
} from '@use-cases/command/approve-product';

const useCase: Provider[] = [
  ApproveProductHandler,
  ApproveProductRequestValidator,
  ApproveProductProcess,
  ApproveProductMapper,
];

const controllers = [V1ApproveProductHttpController];
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
export class ApproveProductModule {}
