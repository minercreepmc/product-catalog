import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters/post-http-controller.base';
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
import { match } from 'oxide.ts';
import { V1RemoveProductsHttpRequest } from './remove-products.http.request.v1';
import { V1RemoveProductsHttpResponse } from './remove-products.http.response.v1';

@Controller('/api/v1/products/remove')
export class V1RemoveProductsHttpController extends HttpControllerBase<
  V1RemoveProductsHttpRequest,
  RemoveProductsCommand,
  V1RemoveProductsHttpResponse
> {
  @Post()
  @HttpCode(HttpStatus.OK)
  async execute(@Body() request: V1RemoveProductsHttpRequest): Promise<any> {
    return super._execute({ request });
  }

  toCommand({
    request,
  }: HttpControllerBaseOption<V1RemoveProductsHttpRequest>): RemoveProductsCommand {
    const { ids } = request;

    const command = new RemoveProductsCommand({
      ids: ids?.map((id) => new ProductIdValueObject(id)),
    });
    return command;
  }

  validate(command: RemoveProductsCommand): void {
    const exceptions = command.validate();

    if (exceptions.length > 0) {
      throw new UnprocessableEntityException(exceptions);
    }
  }

  extractResult(result: any): V1RemoveProductsHttpResponse {
    return match(result, {
      Ok: (response: RemoveProductsResponseDto) =>
        new V1RemoveProductsHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }

        throw e;
      },
    });
  }

  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
}
