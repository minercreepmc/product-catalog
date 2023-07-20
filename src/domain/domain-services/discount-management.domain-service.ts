// import { DiscountAggregate } from '@aggregates/discount';
// import { DiscountCreatedDomainEvent } from '@domain-events/discount';
// import { DiscountDomainExceptions } from '@domain-exceptions/discount';
// import { Inject } from '@nestjs/common';
// import { DiscountNameValueObject } from '@value-objects/discount';
//
// export interface CreateOptions {
//   name: DiscountNameValueObject;
// }
//
// export class DiscountManagementDomainService {
//   async createDiscount(
//     options: CreateOptions,
//   ): Promise<DiscountCreatedDomainEvent> {
//     if (this.discountRepository.findOneByName(options.name)) {
//       throw new DiscountDomainExceptions.AlreadyExist();
//     }
//     const aggregate = new DiscountAggregate();
//
//     const event = aggregate.createDiscount(options);
//
//     await this.discountRepository.create(aggregate);
//
//     return event;
//   }
//
//   async isDiscountExistByName(name: DiscountNameValueObject): Promise<boolean> {
//     return Boolean(this.discountRepository.findOneByName(name));
//   }
//
//   constructor(
//     @Inject(discountRepositoryDiToken)
//     private readonly discountRepository: DiscountRepositoryPort,
//   ) {}
// }
