import { eventBusDiToken } from '@domain-interfaces/events';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
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
    eventBus,
  ],
  exports: [
    CategoryManagementDomainService,
    CategoryVerificationDomainService,
    ProductManagementDomainService,
  ],
})
export class DomainServicesModule {}
