import { V1SubmitForApprovalHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { SubmitForApprovalHandler } from '@use-cases/submit-for-approval';
import {
  SubmitForApprovalMapper,
  SubmitForApprovalProcess,
  SubmitForApprovalRequestValidator,
} from '@use-cases/submit-for-approval/application-services';
import { MediatorModule } from 'nestjs-mediator';
import { DatabaseModule } from '../infrastructures/database';
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
