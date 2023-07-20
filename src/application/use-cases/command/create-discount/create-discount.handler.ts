// import { DiscountManagementDomainService } from '@domain-services';
// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { Err, Ok } from 'oxide.ts';
// import {
//   CreateDiscountCommand,
//   CreateDiscountResponseDto,
// } from './create-discount.dto';
// import {
//   CreateDiscountResult,
//   CreateDiscountValidator,
// } from './create-discount.validator';
// import { DefaultCatch } from 'catch-decorator-ts';
//
// @CommandHandler(CreateDiscountCommand)
// export class CreateDiscountHandler
//   implements ICommandHandler<CreateDiscountCommand, CreateDiscountResult>
// {
//   @DefaultCatch((err) => Err(err))
//   async execute(command: CreateDiscountCommand): Promise<CreateDiscountResult> {
//     const result = this.validator.validate(command);
//     if (result.hasExceptions()) {
//       return Err(result.getExceptions());
//     }
//
//     const discountCreated = await this.discountManagementService.createDiscount(
//       {
//         name: command.name,
//       },
//     );
//
//     return Ok(
//       new CreateDiscountResponseDto({
//         name: discountCreated.name.value,
//       }),
//     );
//   }
//
//   constructor(
//     private readonly validator: CreateDiscountValidator,
//     private readonly discountManagementService: DiscountManagementDomainService,
//   ) {}
// }
