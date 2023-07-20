import { DomainExceptionBase } from '@base/domain';
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  RemoveProductsCommand,
  RemoveProductsResponseDto,
} from '@use-cases/command/remove-products';
import { ProductIdValueObject } from '@value-objects/product';
import { validate } from 'class-validator';
import { match } from 'oxide.ts';
import { V1RemoveProductsHttpRequest } from './remove-products.http.request.v1';
import { V1RemoveProductsHttpResponse } from './remove-products.http.response.v1';

@Controller('/api/v1/products/remove')
export class V1RemoveProductsHttpController {
  @Post()
  @HttpCode(HttpStatus.OK)
  async execute(@Body() request: V1RemoveProductsHttpRequest): Promise<any> {
    const command = new RemoveProductsCommand({
      ids: request.ids.map((id) => new ProductIdValueObject(id)),
    });

    const exceptions = await validate(command);

    if (exceptions.length > 0) {
      throw new UnprocessableEntityException(exceptions);
    }

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: RemoveProductsResponseDto) =>
        new V1RemoveProductsHttpResponse(response),
      Err: (exception: Error) => {
        if (exception instanceof DomainExceptionBase) {
          throw new ConflictException(exception.message);
        }

        throw new InternalServerErrorException(exception.message);
      },
    });
  }

  constructor(private readonly commandBus: CommandBus) {}
}
