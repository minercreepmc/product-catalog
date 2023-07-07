import { HttpPostControllerBase } from '@base/interface-adapters/http';
import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  RemoveProductsRequestDto,
  RemoveProductsResponseDto,
} from '@use-cases/command/remove-products/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1RemoveProductsHttpRequest } from './remove-products.http.request.v1';
import { V1RemoveProductsHttpResponse } from './remove-products.http.response.v1';

@Controller('/api/v1/products/remove')
export class V1RemoveProductsHttpController extends HttpPostControllerBase<
  V1RemoveProductsHttpRequest,
  V1RemoveProductsHttpResponse
> {
  @Post()
  @HttpCode(HttpStatus.OK)
  execute(httpRequest: V1RemoveProductsHttpRequest): Promise<any> {
    return super.execute(httpRequest);
  }

  createDto(
    httpRequest: V1RemoveProductsHttpRequest,
  ): RemoveProductsRequestDto {
    return new RemoveProductsRequestDto(httpRequest);
  }
  createHttpResponse(
    response: RemoveProductsResponseDto,
  ): V1RemoveProductsHttpResponse {
    return new V1RemoveProductsHttpResponse(response);
  }

  constructor(mediator: Mediator) {
    super(mediator);
  }
}
