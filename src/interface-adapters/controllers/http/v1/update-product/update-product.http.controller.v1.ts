import { HttpFilePutController } from '@base/interface-adapters/http/put-file.controller.base';
import { Controller } from '@nestjs/common';
import {
  UpdateProductRequestDto,
  UpdateProductResponseDto,
} from '@use-cases/command/update-product/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1UpdateProductHttpRequest } from './update-product.http.request.v1';
import { V1UpdateProductHttpResponse } from './update-product.http.response.v1';

@Controller('/api/v1/products/:id/update')
export class V1UpdateProductHttpController extends HttpFilePutController<
  V1UpdateProductHttpRequest,
  V1UpdateProductHttpResponse
> {
  constructor(mediator: Mediator) {
    super(mediator);
  }
  createDto(
    httpRequest: V1UpdateProductHttpRequest,
    file: Express.Multer.File,
    id?: string,
  ): UpdateProductRequestDto {
    return new UpdateProductRequestDto({
      id: id,
      name: httpRequest.name,
      description: httpRequest.description,
      price: httpRequest.price,
      image: file,
    });
  }
  createHttpResponse(
    response: UpdateProductResponseDto,
  ): V1UpdateProductHttpResponse {
    return new V1UpdateProductHttpResponse(response);
  }
}
