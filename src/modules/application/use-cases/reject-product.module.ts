import { V1RejectProductHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { DatabaseModule } from '@modules/infrastructures/database';
import { Module, Provider } from '@nestjs/common';
import {
  RejectProductHandler,
  RejectProductMapper,
  RejectProductProcess,
  RejectProductRequestValidator,
} from '@use-cases/command/reject-product';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';

const useCase: Provider[] = [
  RejectProductHandler,
  RejectProductRequestValidator,
  RejectProductProcess,
  RejectProductMapper,
];

const controllers = [V1RejectProductHttpController];

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
export class RejectProductModule {}
