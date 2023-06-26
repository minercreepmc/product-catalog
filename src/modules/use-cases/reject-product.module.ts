import { V1RejectProductHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { RejectProductHandler } from '@use-cases/reject-product';
import {
  RejectProductMapper,
  RejectProductProcess,
  RejectProductRequestValidator,
} from '@use-cases/reject-product/application-services';
import { MediatorModule } from 'nestjs-mediator';
import { DatabaseModule } from '../infrastructures/database';
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
