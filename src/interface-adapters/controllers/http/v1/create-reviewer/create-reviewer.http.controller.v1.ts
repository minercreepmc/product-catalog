import { Controller, Post } from '@nestjs/common';
import { V1CreateReviewerHttpRequest } from './create-reviewer.http.request.v1';
import { V1CreateReviewerHttpResponse } from './create-reviewer.http.response.v1';
import {
  CreateReviewerRequestDto,
  CreateReviewerResponseDto,
} from '@use-cases/create-reviewer/dtos';
import { Mediator } from 'nestjs-mediator';
import { HttpPostControllerBase } from '@base/interface-adapters/http';

@Controller('/api/v1/reviewers')
export class V1CreateReviewerHttpController extends HttpPostControllerBase<
  V1CreateReviewerHttpRequest,
  V1CreateReviewerHttpResponse
> {
  constructor(mediator: Mediator) {
    super(mediator);
  }

  @Post()
  async execute(httpRequest: V1CreateReviewerHttpRequest) {
    return super.execute(httpRequest);
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
