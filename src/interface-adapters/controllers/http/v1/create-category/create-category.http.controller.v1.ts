import { HttpPostControllerBase } from '@base/interface-adapters/http';
import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateCategoryRequestDto,
  CreateCategoryResponseDto,
} from '@use-cases/command/create-category/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1CreateCategoryHttpRequest } from './create-category.http.request.v1';
import { V1CreateCategoryHttpResponse } from './create-category.http.response.v1';

@Controller('/api/v1/categories/create')
export class V1CreateCategoryHttpController extends HttpPostControllerBase<
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse
> {
  @Post()
  execute(@Body() request: V1CreateCategoryHttpRequest) {
    return super.execute(request);
  }

  constructor(mediator: Mediator) {
    super(mediator);
  }
  createDto(
    httpRequest: V1CreateCategoryHttpRequest,
  ): CreateCategoryRequestDto {
    return new CreateCategoryRequestDto(httpRequest);
  }
  createHttpResponse(
    response: CreateCategoryResponseDto,
  ): V1CreateCategoryHttpResponse {
    return new V1CreateCategoryHttpResponse(response);
  }
}
