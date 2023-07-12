import { V1SubmitForApprovalHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { DatabaseModule } from '@modules/infrastructures/database';
import { Module, Provider } from '@nestjs/common';
import {
  SubmitForApprovalHandler,
  SubmitForApprovalMapper,
  SubmitForApprovalProcess,
  SubmitForApprovalRequestValidator,
} from '@use-cases/command/submit-for-approval';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';

const useCase: Provider[] = [
  SubmitForApprovalHandler,
  SubmitForApprovalRequestValidator,
  SubmitForApprovalProcess,
  SubmitForApprovalMapper,
];

const controllers = [V1SubmitForApprovalHttpController];

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
export class SubmitForApprovalModule {}
