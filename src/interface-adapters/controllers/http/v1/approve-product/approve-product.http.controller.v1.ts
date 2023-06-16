import { HttpPutControllerBase } from '@base/interface-adapters/http';
import { Controller } from '@nestjs/common';
import {
  ApproveProductRequestDto,
  ApproveProductResponseDto,
} from '@use-cases/approve-product/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1ApproveProductHttpRequest } from './approve-product.http.request.v1';
import { V1ApproveProductHttpResponse } from './approve-product.http.response.v1';

@Controller('/api/v1/products/:id/approve')
export class V1ApproveProductHttpController extends HttpPutControllerBase<
  V1ApproveProductHttpRequest,
  V1ApproveProductHttpResponse
> {
  constructor(mediator: Mediator) {
    super(mediator);
  }
  createDto(
    httpRequest: V1ApproveProductHttpRequest,
    id?: string,
  ): ApproveProductRequestDto {
    return new ApproveProductRequestDto({
      productId: id,
      reviewerId: httpRequest.reviewerId,
    });
  }
  createHttpResponse(
    response: ApproveProductResponseDto,
  ): V1ApproveProductHttpResponse {
    return new V1ApproveProductHttpResponse(response);
  }
}
