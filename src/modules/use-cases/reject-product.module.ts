import { V1RejectProductHttpController } from '@controllers/http/v1';
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RejectProductHandler } from '@use-cases/reject-product';
import {
  RejectProductMapper,
  RejectProductProcess,
  RejectProductValidator,
} from '@use-cases/reject-product/application-services';
import { DatabaseModule } from '../infrastructures/database';

const domainServices: Provider[] = [
  ProductManagementDomainService,
  ReviewerManagementDomainService,
  ProductApprovalDomainService,
];

const applicationServices: Provider[] = [
  RejectProductHandler,
  RejectProductValidator,
  RejectProductProcess,
  RejectProductMapper,
];

const controllers = [V1RejectProductHttpController];

const vendors = [CqrsModule, DatabaseModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...applicationServices],
})
export class RejectProductModule {}
