import { eventBusDiToken } from '@domain-interfaces/events';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  DiscountManagementDomainService,
  ProductManagementDomainService,
} from '@domain-services';
import { EventBusAdapter } from '@infrastructures/events';
import { Module, Provider } from '@nestjs/common';
import { MediatorModule } from 'nestjs-mediator';

const eventBus: Provider = {
  provide: eventBusDiToken,
  useClass: EventBusAdapter,
};
const sharedModules = [MediatorModule];

@Module({
  imports: [...sharedModules],
  providers: [
    CategoryManagementDomainService,
    CategoryVerificationDomainService,
    ProductManagementDomainService,
    DiscountManagementDomainService,
    eventBus,
  ],
  exports: [
    CategoryManagementDomainService,
    CategoryVerificationDomainService,
    DiscountManagementDomainService,
    ProductManagementDomainService,
  ],
})
export class DomainServicesModule {}
