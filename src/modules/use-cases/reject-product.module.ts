import { V1RejectProductHttpController } from '@controllers/http/v1';
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { RejectProductHandler } from '@use-cases/reject-product';
import {
  RejectProductMapper,
  RejectProductProcess,
  RejectProductRequestValidator,
} from '@use-cases/reject-product/application-services';
import { MediatorModule } from 'nestjs-mediator';
import { DatabaseModule } from '../infrastructures/database';

const domainServices: Provider[] = [
  ProductManagementDomainService,
  ReviewerManagementDomainService,
  ProductApprovalDomainService,
];

const applicationServices: Provider[] = [
  RejectProductHandler,
  RejectProductRequestValidator,
  RejectProductProcess,
  RejectProductMapper,
];

const controllers = [V1RejectProductHttpController];

const vendors = [MediatorModule, DatabaseModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...applicationServices],
})
export class RejectProductModule {}
