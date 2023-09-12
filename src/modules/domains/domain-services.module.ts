import {
  ProductManagementDomainService,
  UserRegistrationDomainService,
  UserVerificationDomainService,
} from '@domain-services';
import { ProductVerificationDomainService } from '@domain-services/product-verification.domain-service';
//import { EventBusAdapter } from '@infrastructures/events';
//import { eventBusDiToken } from '@domain-interfaces/events';

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
//
// const eventBus: Provider = {
//   provide: eventBusDiToken,
//   useClass: EventBusAdapter,
// };
@Module({
  imports: [CqrsModule],
  providers: [
    ProductManagementDomainService,
    ProductVerificationDomainService,
    UserRegistrationDomainService,
    UserVerificationDomainService,
    // eventBus,
  ],
  exports: [
    ProductVerificationDomainService,
    ProductManagementDomainService,
    UserRegistrationDomainService,
    UserVerificationDomainService,
  ],
})
export class DomainServicesModule {}
