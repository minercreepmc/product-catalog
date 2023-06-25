import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructures/database';

@Module({
  imports: [DatabaseModule],
  providers: [
    CategoryManagementDomainService,
    CategoryVerificationDomainService,
    ProductApprovalDomainService,
    ProductManagementDomainService,
    ReviewerManagementDomainService,
  ],
  exports: [
    CategoryManagementDomainService,
    CategoryVerificationDomainService,
    ProductApprovalDomainService,
    ProductManagementDomainService,
    ReviewerManagementDomainService,
  ],
})
export class DomainServicesModule {}
