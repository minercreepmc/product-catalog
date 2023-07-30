import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  DiscountManagementDomainService,
  ProductManagementDomainService,
  UserRegistrationDomainService,
} from '@domain-services';
import { EventBusAdapter } from '@infrastructures/events';
import { AuthModule } from '@modules/infrastructures/auth';
//import { eventBusDiToken } from '@domain-interfaces/events';

import { Module } from '@nestjs/common';
// import { CqrsModule } from '@nestjs/cqrs';
//
// const eventBus: Provider = {
//   provide: eventBusDiToken,
//   useClass: EventBusAdapter,
// };
const sharedModules = [AuthModule];

@Module({
  imports: [...sharedModules],
  providers: [
    CategoryManagementDomainService,
    CategoryVerificationDomainService,
    ProductManagementDomainService,
    DiscountManagementDomainService,
    UserRegistrationDomainService,
    // eventBus,
  ],
  exports: [
    CategoryManagementDomainService,
    CategoryVerificationDomainService,
    DiscountManagementDomainService,
    ProductManagementDomainService,
    UserRegistrationDomainService,
  ],
})
export class DomainServicesModule {}
