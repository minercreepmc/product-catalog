import { HttpPutControllerBase } from '@base/interface-adapters/http';
import { Controller, Put } from '@nestjs/common';
import {
  RemoveReviewerRequestDto,
  RemoveReviewerResponseDto,
} from '@use-cases/command/remove-reviewer/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1RemoveReviewerHttpRequest } from './remove-reviewer.http.request.v1';
import { V1RemoveReviewerHttpResponse } from './remove-reviewer.http.response.v1';

@Controller('/api/v1/reviewers/:id/remove')
export class V1RemoveReviewerHttpController extends HttpPutControllerBase<
  V1RemoveReviewerHttpRequest,
  V1RemoveReviewerHttpResponse
> {
  constructor(mediator: Mediator) {
    super(mediator);
  }

  @Put()
  execute(
    httpRequest: V1RemoveReviewerHttpRequest,
    id: string,
  ): Promise<V1RemoveReviewerHttpResponse> {
    return super.execute(httpRequest, id);
  }

  createDto(
    httpRequest: V1RemoveReviewerHttpRequest,
    id?: string,
  ): RemoveReviewerRequestDto {
    return new RemoveReviewerRequestDto({
      id,
    });
  }
  createHttpResponse(
    response: RemoveReviewerResponseDto,
  ): V1RemoveReviewerHttpResponse {
    return new V1RemoveReviewerHttpResponse(response);
  }
}
