import { V1ApproveProductHttpController } from '@controllers/http/v1';
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApproveProductHandler } from '@use-cases/approve-product';
import {
  ApproveProductMapper,
  ApproveProductProcess,
  ApproveProductValidator,
} from '@use-cases/approve-product/application-services';
import { DatabaseModule } from '@modules/infrastructures/database';

const domainServices: Provider[] = [
  ProductManagementDomainService,
  ReviewerManagementDomainService,
  ProductApprovalDomainService,
];

const useCases: Provider[] = [
  ApproveProductHandler,
  ApproveProductValidator,
  ApproveProductProcess,
  ApproveProductMapper,
];

const controllers = [V1ApproveProductHttpController];
const vendors = [CqrsModule];

@Module({
  imports: [...vendors, DatabaseModule],
  controllers,
  providers: [...domainServices, ...useCases],
})
export class ApproveProductModule {}
