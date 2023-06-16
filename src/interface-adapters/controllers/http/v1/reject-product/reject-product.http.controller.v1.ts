import { HttpPutControllerBase } from '@base/interface-adapters/http';
import { Controller } from '@nestjs/common';
import {
  RejectProductRequestDto,
  RejectProductResponseDto,
} from '@use-cases/reject-product/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1RejectProductHttpRequest } from './reject-product.http.request.v1';
import { V1RejectProductHttpResponse } from './reject-product.http.response.v1';

@Controller('/api/v1/products/:id/reject')
export class V1RejectProductHttpController extends HttpPutControllerBase<
  V1RejectProductHttpRequest,
  V1RejectProductHttpResponse
> {
  constructor(mediator: Mediator) {
    super(mediator);
  }
  createDto(
    httpRequest: V1RejectProductHttpRequest,
    id?: string,
  ): RejectProductRequestDto {
    return new RejectProductRequestDto({
      productId: id,
      reason: httpRequest.reason,
      reviewerId: httpRequest.reviewerId,
    });
  }
  createHttpResponse(
    response: RejectProductResponseDto,
  ): V1RejectProductHttpResponse {
    return new V1RejectProductHttpResponse(response);
  }
}
