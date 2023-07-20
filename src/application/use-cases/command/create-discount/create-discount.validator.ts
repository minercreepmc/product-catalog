// import { Notification } from '@base/patterns';
// import { DiscountDomainExceptions } from '@domain-exceptions/discount';
// import { DiscountManagementDomainService } from '@domain-services';
// import { Injectable } from '@nestjs/common';
// import { Result } from 'oxide.ts/dist';
// import {
//   CreateDiscountCommand,
//   CreateDiscountResponseDto,
// } from './create-discount.dto';
//
// export type CreateDiscountSuccess = CreateDiscountResponseDto;
// export type CreateDiscountFailure =
//   Array<DiscountDomainExceptions.AlreadyExist>;
// export type CreateDiscountResult = Result<
//   CreateDiscountSuccess,
//   CreateDiscountFailure
// >;
//
// @Injectable()
// export class CreateDiscountValidator {
//   async validate(command: CreateDiscountCommand) {
//     this.command = command;
//
//     const note = new Notification<CreateDiscountFailure>();
//
//     await this.nameMustBeUnique(note);
//     return note;
//   }
//
//   private async nameMustBeUnique(note: Notification<CreateDiscountFailure>) {
//     const isExist = this.discountManagement.isDiscountExistByName(
//       this.command.name,
//     );
//
//     if (isExist) {
//       note.addException(new DiscountDomainExceptions.AlreadyExist());
//     }
//   }
//
//   protected command: CreateDiscountCommand;
//   constructor(
//     private readonly discountManagement: DiscountManagementDomainService,
//   ) {}
// }
