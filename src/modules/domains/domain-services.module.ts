import {
  CartManagementDomainService,
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  DiscountManagementDomainService,
  DiscountVerificationDomainService,
  ProductManagementDomainService,
  UserRegistrationDomainService,
  UserVerificationDomainService,
} from '@domain-services';
import { CartVerificationDomainService } from '@domain-services/cart-verification.domain-service';
import { ProductVerificationDomainService } from '@domain-services/product-verification.domain-service';
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
    ProductVerificationDomainService,
    DiscountManagementDomainService,
    DiscountVerificationDomainService,
    UserRegistrationDomainService,
    UserVerificationDomainService,
    CartManagementDomainService,
    CartVerificationDomainService,
    // eventBus,
  ],
  exports: [
    CategoryManagementDomainService,
    CategoryVerificationDomainService,
    DiscountManagementDomainService,
    DiscountVerificationDomainService,
    ProductVerificationDomainService,
    ProductManagementDomainService,
    UserRegistrationDomainService,
    UserVerificationDomainService,
    CartManagementDomainService,
    CartVerificationDomainService,
  ],
})
export class DomainServicesModule {}
