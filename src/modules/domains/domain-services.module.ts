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
import { OrderManagementDomainService } from '@domain-services/order-management.domain-service';
import { ProductVerificationDomainService } from '@domain-services/product-verification.domain-service';
import { EventBusAdapter } from '@infrastructures/events';
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
    OrderManagementDomainService,
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
    OrderManagementDomainService,
  ],
})
export class DomainServicesModule {}
