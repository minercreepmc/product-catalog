// import { DomainExceptionBase } from '@base/domain';
// import {
//   Body,
//   ConflictException,
//   Controller,
//   InternalServerErrorException,
//   Post,
//   UnprocessableEntityException,
// } from '@nestjs/common';
// import { CommandBus } from '@nestjs/cqrs';
// import {
//   CreateDiscountCommand,
//   CreateDiscountResponseDto,
// } from '@use-cases/command/create-discount';
// import { DiscountNameValueObject } from '@value-objects/discount';
// import { validate } from 'class-validator';
// import { match } from 'oxide.ts';
// import { V1CreateDiscountHttpRequest } from './create-discount.http.request.v1';
// import { V1CreateDiscountHttpResponse } from './create-discount.http.response.v1';
//
// @Controller()
// export class V1CreateDiscountHttpController {
//   @Post()
//   async execute(@Body() request: V1CreateDiscountHttpRequest) {
//     const { name } = request;
//     const command = new CreateDiscountCommand({
//       name: new DiscountNameValueObject(name),
//     });
//
//     const exceptions = await validate(command);
//
//     if (exceptions.length > 0) {
//       throw new UnprocessableEntityException(exceptions);
//     }
//
//     const result = await this.commandBus.execute(command);
//
//     return match(result, {
//       Ok: (response: CreateDiscountResponseDto) =>
//         new V1CreateDiscountHttpResponse(response),
//       Err: (exception: Error) => {
//         if (exception instanceof DomainExceptionBase) {
//           throw new ConflictException(exception.message);
//         }
//
//         throw new InternalServerErrorException(exception.message);
//       },
//     });
//   }
//
//   constructor(private readonly commandBus: CommandBus) {}
// }
