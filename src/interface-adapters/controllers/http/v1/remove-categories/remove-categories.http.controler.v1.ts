import { HttpPostControllerBase } from '@base/interface-adapters/http';
import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  RemoveCategoriesRequestDto,
  RemoveCategoriesResponseDto,
} from '@use-cases/command/remove-categories/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1RemoveCategoriesHttpRequest } from './remove-categories.http.request.v1';
import { V1RemoveCategoriesHttpResponse } from './remove-categories.http.response.v1';

@Controller('/api/v1/categories/remove')
export class V1RemoveCategoriesHttpController extends HttpPostControllerBase<
  V1RemoveCategoriesHttpRequest,
  V1RemoveCategoriesHttpResponse
> {
  @Post()
  @HttpCode(HttpStatus.OK)
  execute(request: V1RemoveCategoriesHttpRequest): Promise<any> {
    return super.execute(request);
  }

  createDto(
    httpRequest: V1RemoveCategoriesHttpRequest,
  ): RemoveCategoriesRequestDto {
    return new RemoveCategoriesRequestDto(httpRequest);
  }
  createHttpResponse(
    response: RemoveCategoriesResponseDto,
  ): V1RemoveCategoriesHttpResponse {
    return new V1RemoveCategoriesHttpResponse(response);
  }

  constructor(mediator: Mediator) {
    super(mediator);
  }
}
