import { HttpPutControllerBase } from '@base/interface-adapters/http';
import { Controller } from '@nestjs/common';
import {
  UpdateProductRequestDto,
  UpdateProductResponseDto,
} from '@use-cases/update-product/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1UpdateProductHttpRequest } from './update-product.http.request.v1';
import { V1UpdateProductHttpResponse } from './update-product.http.response.v1';

@Controller('/api/v1/products/:id')
export class V1UpdateProductHttpController extends HttpPutControllerBase<
  V1UpdateProductHttpRequest,
  V1UpdateProductHttpResponse
> {
  constructor(mediator: Mediator) {
    super(mediator);
  }
  createDto(
    httpRequest: V1UpdateProductHttpRequest,
    id?: string,
  ): UpdateProductRequestDto {
    return new UpdateProductRequestDto({
      productId: id,
      name: httpRequest.name,
      description: httpRequest.description,
      price: httpRequest.price,
      image: httpRequest.image,
    });
  }
  createHttpResponse(
    response: UpdateProductResponseDto,
  ): V1UpdateProductHttpResponse {
    return new V1UpdateProductHttpResponse(response);
  }
}