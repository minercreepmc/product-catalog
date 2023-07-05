import { HttpPostControllerBase } from '@base/interface-adapters/http';
import { Controller } from '@nestjs/common';
import {
  CreateReviewerRequestDto,
  CreateReviewerResponseDto,
} from '@use-cases/command/create-reviewer/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1CreateReviewerHttpRequest } from './create-reviewer.http.request.v1';
import { V1CreateReviewerHttpResponse } from './create-reviewer.http.response.v1';

@Controller('/api/v1/reviewers')
export class V1CreateReviewerHttpController extends HttpPostControllerBase<
  V1CreateReviewerHttpRequest,
  V1CreateReviewerHttpResponse
> {
  constructor(mediator: Mediator) {
    super(mediator);
  }

  createDto(
    httpRequest: V1CreateReviewerHttpRequest,
  ): CreateReviewerRequestDto {
    return new CreateReviewerRequestDto(httpRequest);
  }

  createHttpResponse(
    response: CreateReviewerResponseDto,
  ): V1CreateReviewerHttpResponse {
    return new V1CreateReviewerHttpResponse(response);
  }
}
