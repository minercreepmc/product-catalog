import { V1SubmitForApprovalHttpController } from '@controllers/http/v1';
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { SubmitForApprovalHandler } from '@use-cases/submit-for-approval';
import {
  SubmitForApprovalMapper,
  SubmitForApprovalProcess,
  SubmitForApprovalValidator,
} from '@use-cases/submit-for-approval/application-services';
import { MediatorModule } from 'nestjs-mediator';
import { DatabaseModule } from '../infrastructures/database';

const domainServices: Provider[] = [
  ProductManagementDomainService,
  ReviewerManagementDomainService,
  ProductApprovalDomainService,
];

const useCases: Provider[] = [
  SubmitForApprovalHandler,
  SubmitForApprovalValidator,
  SubmitForApprovalProcess,
  SubmitForApprovalMapper,
];

const controllers = [V1SubmitForApprovalHttpController];

const vendors = [MediatorModule, DatabaseModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...useCases],
})
export class SubmitForApprovalModule {}
