import { PostHttpControllerBase } from '@base/inteface-adapters/post-http-controller.base';
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
export class V1RemoveProductsHttpController extends PostHttpControllerBase<
  V1RemoveProductsHttpRequest,
  RemoveProductsCommand,
  V1RemoveProductsHttpResponse
> {
  @Post()
  @HttpCode(HttpStatus.OK)
  async execute(@Body() request: V1RemoveProductsHttpRequest): Promise<any> {
    return super.execute(request);
  }

  toCommand(request: V1RemoveProductsHttpRequest): RemoveProductsCommand {
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
      Err: (exception: Error) => {
        if ((exception as any).length > 0) {
          throw new ConflictException(exception);
        }

        throw new InternalServerErrorException(exception);
      },
    });
  }

  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
}
