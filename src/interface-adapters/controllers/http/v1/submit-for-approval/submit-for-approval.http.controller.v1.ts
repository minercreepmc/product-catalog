import { HttpPutControllerBase } from '@base/interface-adapters/http';
import { Controller } from '@nestjs/common';
import {
  SubmitForApprovalRequestDto,
  SubmitForApprovalResponseDto,
} from '@use-cases/command/submit-for-approval/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1SubmitForApprovalHttpRequest } from './submit-for-approval.http.request.v1';
import { V1SubmitForApprovalHttpResponse } from './submit-for-approval.http.response.v1';

@Controller('/api/v1/products/:id/submit')
export class V1SubmitForApprovalHttpController extends HttpPutControllerBase<
  V1SubmitForApprovalHttpRequest,
  V1SubmitForApprovalHttpResponse
> {
  constructor(mediator: Mediator) {
    super(mediator);
  }
  createDto(
    httpRequest: V1SubmitForApprovalHttpRequest,
    id?: string,
  ): SubmitForApprovalRequestDto {
    return new SubmitForApprovalRequestDto({
      productId: id,
      reviewerId: httpRequest.reviewerId,
    });
  }
  createHttpResponse(
    response: SubmitForApprovalResponseDto,
  ): V1SubmitForApprovalHttpResponse {
    return new V1SubmitForApprovalHttpResponse(response);
  }
}
