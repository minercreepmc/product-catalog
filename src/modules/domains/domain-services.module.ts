import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  DiscountManagementDomainService,
  ProductManagementDomainService,
} from '@domain-services';
import { EventBusAdapter } from '@infrastructures/events';
//import { eventBusDiToken } from '@domain-interfaces/events';

import { Module } from '@nestjs/common';
// import { CqrsModule } from '@nestjs/cqrs';
//
// const eventBus: Provider = {
//   provide: eventBusDiToken,
//   useClass: EventBusAdapter,
// };
// const sharedModules = [CqrsModule];

@Module({
  //imports: [...sharedModules],
  providers: [
    CategoryManagementDomainService,
    CategoryVerificationDomainService,
    ProductManagementDomainService,
    DiscountManagementDomainService,
    // eventBus,
  ],
  exports: [
    CategoryManagementDomainService,
    CategoryVerificationDomainService,
    DiscountManagementDomainService,
    ProductManagementDomainService,
  ],
})
export class DomainServicesModule {}
