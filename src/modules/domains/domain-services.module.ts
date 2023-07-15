import { eventBusDiToken } from '@domain-interfaces/events';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { EventBusAdapter } from '@infrastructures/events';
import { Module, Provider } from '@nestjs/common';
import { MediatorModule } from 'nestjs-mediator';
import { DatabaseModule } from '../infrastructures/database';

const eventBus: Provider = {
  provide: eventBusDiToken,
  useClass: EventBusAdapter,
};
const sharedModules = [DatabaseModule, MediatorModule];

@Module({
  imports: [...sharedModules],
  providers: [
    CategoryManagementDomainService,
    CategoryVerificationDomainService,
    ProductApprovalDomainService,
    ProductManagementDomainService,
    ReviewerManagementDomainService,
    eventBus,
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
