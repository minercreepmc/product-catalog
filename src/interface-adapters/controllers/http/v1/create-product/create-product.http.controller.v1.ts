import { HttpPostControllerBase } from '@base/interface-adapters/http';
import { Controller } from '@nestjs/common';
import {
  CreateProductRequestDto,
  CreateProductResponseDto,
} from '@use-cases/create-product/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1CreateProductHttpRequest } from './create-product.http.request.v1';
import { V1CreateProductHttpResponse } from './create-product.http.response.v1';

@Controller('/api/v1/products')
export class V1CreateProductHttpController extends HttpPostControllerBase<
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse
> {
  constructor(mediator: Mediator) {
    super(mediator);
  }

  createDto(httpRequest: V1CreateProductHttpRequest): CreateProductRequestDto {
    return new CreateProductRequestDto(httpRequest);
  }
  createHttpResponse(
    response: CreateProductResponseDto,
  ): V1CreateProductHttpResponse {
    return new V1CreateProductHttpResponse(response);
  }
}
